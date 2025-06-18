using System.Data.Common;
using Dapper;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Logging;
using WebCrawler.DbModels;

namespace WebCrawler;

public class SqliteConnector : IDatabase
{
    private readonly string _connectionString;
    private DbConnection _dbConnection;
    private readonly ILogger<SqliteConnector> _logger;
   
    public SqliteConnector(DbInfo dbInfo, ILogger<SqliteConnector> logger)
    {
        _connectionString = dbInfo.ConnectionString;
        _logger = logger;
        _dbConnection = SqliteFactory.Instance.CreateConnection();
        _dbConnection.ConnectionString = _connectionString;
    }

    public void Initalize()
    {
        _dbConnection.Open();

        string query = """
                       create table if not exists urls(
                            id integer primary key autoincrement,
                            url text not null unique,
                            last_check text,
                            raw_content text
                           );
                       """;
        
        _dbConnection.Execute(query);
        
        _dbConnection.Close();
    }

    public async Task<DateTime> UrlLastChecked(string url)
    {
        await _dbConnection.OpenAsync();

        var date = await _dbConnection.QueryAsync<DateTime?>(
            "SELECT last_check from urls where url is @url;",
            new { url });
        
        await _dbConnection.CloseAsync();
        
        _logger.LogTrace("UrlLastChecked: {date}", date);
        
        return date.FirstOrDefault() ?? DateTime.MinValue;
    }

    public async Task UpsertUrl(string url, DateTime? lastChecked = null, string? content = null, string? title = null)
    {
        await _dbConnection.OpenAsync();
        var transaction = await _dbConnection.BeginTransactionAsync();

        try
        {
            var res = await _dbConnection.QueryAsync<UrlRow?>(
                "select * from urls where url is @url;",
                new { url },
                transaction);

            var urlRow = res.FirstOrDefault();

            if (urlRow.HasValue)
            {
                _logger.LogTrace("Updating Url: {url}, last updated : {lastChecked}", url, lastChecked ?? urlRow.Value.LastChecked);
                await _dbConnection.ExecuteAsync(
                    "update urls set last_check = @date, raw_content = @content where url is @url",
                    new { date = lastChecked ?? urlRow.Value.LastChecked, content = content ?? urlRow.Value.Content, url = urlRow },
                    transaction);
            }
            else
            {
                _logger.LogTrace("Inserting Url: {url}, last updated : {lastChecked}", url, lastChecked);

                await _dbConnection.ExecuteAsync(
                    "insert into urls (url, last_check, raw_content) values (@url, @date, @content);",
                    new { date = lastChecked ?? DateTime.MinValue, content, url },
                    transaction);
            }

            await transaction.CommitAsync();

        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
        }

        await _dbConnection.CloseAsync();
    }

    public Task UpsertToken(string url, string token, int count)
    {
        throw new NotImplementedException();
    }

    public async Task<IEnumerable<string>> ListUrls()
    {
        await _dbConnection.OpenAsync();
        var result = await _dbConnection.QueryAsync<string>(
            "Select url from urls;");
        await _dbConnection.CloseAsync();

        var listUrls = result as string[] ?? result.ToArray();
        var count =  listUrls.Count();
        _logger.LogInformation("Found {count} urls.", count);
        return listUrls;
    }
}