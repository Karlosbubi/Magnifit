using System.Data.Common;
using Dapper;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Logging;
using Npgsql;
using WebCrawler.DbModels;

namespace WebCrawler;

public class PostgresConnector : IDatabase
{
    private readonly string _connectionString;
    private DbConnection _dbConnection;
    private readonly ILogger<PostgresConnector> _logger;
   
    public PostgresConnector(DbInfo dbInfo, ILogger<PostgresConnector> logger)
    {
        _connectionString = dbInfo.ConnectionString;
        _logger = logger;
        _dbConnection = new NpgsqlConnection();
        _dbConnection.ConnectionString = _connectionString;
    }

    public void Initalize()
    {
        _dbConnection.Open();

        string query = """
                       create table if not exists urls(
                            id serial primary key,
                            url text not null unique,
                            last_check timestamp,
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
            "SELECT last_check from urls where url = @url;",
            new { url });
        
        await _dbConnection.CloseAsync();
        
        _logger.LogTrace("UrlLastChecked: {date}", date);
        
        return date.FirstOrDefault() ?? DateTime.MinValue;
    }

    public async Task UpsertUrl(string url, DateTime? lastChecked = null, string? content = null)
    {
        await _dbConnection.OpenAsync();
        var transaction = await _dbConnection.BeginTransactionAsync();
        try
        {
            UrlRow? urlRow = await _dbConnection.QuerySingleOrDefaultAsync<UrlRow>(
                "select * from urls where url = @url;",
                new { url },
                transaction);

            if (urlRow.HasValue)
            {
                _logger.LogTrace("Updating Url: {url}, last updated : {lastChecked}", url,
                    lastChecked ?? urlRow.Value.LastChecked);
                var newDate    = lastChecked ?? urlRow.Value.LastChecked;
                var newContent = content ?? urlRow.Value.Content;
                await _dbConnection.ExecuteAsync(
                    "update urls set last_check = @date, raw_content = @content where url = @url",
                    new
                    {
                        date = newDate, content = newContent,
                        url = url
                    },
                    transaction);
            }
            else
            {
                _logger.LogTrace("Inserting Url: {url}, last updated : {lastChecked}", url, lastChecked);

                await _dbConnection.ExecuteAsync(
                    "insert into urls (url, last_check, raw_content) values (@url, @date, @content);",
                    new { date = lastChecked, content, url },
                    transaction);
            }

            await transaction.CommitAsync();

        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
        }
        finally
        {
            await _dbConnection.CloseAsync();
        }

        
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