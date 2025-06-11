using System.Data.Common;
using Dapper;
using Microsoft.Extensions.Logging;
using Npgsql;
using WebCrawler.DbModels;

namespace WebCrawler;

public class PostgresConnector : IDatabase, IDisposable, IAsyncDisposable
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
        _dbConnection.OpenAsync().Wait();
    }

    public void Initalize()
    {
        string query = """
            create table if not exists urls(
                 id serial primary key,
                 url text not null unique,
                 title text,
                 last_check timestamp,
                 raw_content text
            );
            create table if not exists tokens(
                 id serial primary key,
                 token text not null unique
            );
            create table if not exists usage(
                url int not null,
                token int not null,
                count int not null,
                foreign key (url) references urls(id),
                foreign key (token) references tokens(id),
                primary key (url, token)
            );
            """;

        _dbConnection.Execute(query);
    }

    public async Task<DateTime> UrlLastChecked(string url)
    {
        var date = await _dbConnection.QueryAsync<DateTime?>(
            "SELECT last_check from urls where url = @url;",
            new { url });

        _logger.LogTrace("UrlLastChecked: {date}", date);

        return date.FirstOrDefault() ?? DateTime.MinValue;
    }

    public async Task UpsertUrl(string url, DateTime? lastChecked = null, string? content = null)
    {
        await _dbConnection.ExecuteAsync(
            "insert into urls (url, last_check, raw_content) values (@url, @date, @content) on conflict (url) do update set last_check = excluded.last_check, raw_content = excluded.raw_content;",
            new { date = lastChecked, content, url });
    }

    public async Task<int> AddToken(string token)
    {
        _logger.LogTrace("Adding token: {token}", token);
        _dbConnection.Execute("insert into tokens (token) values (@token);", new {token});
        int token_id = await _dbConnection.QuerySingleAsync<int>(
            "select id from tokens where token = @token;",
            new { token });
        return token_id;
    }

    public async Task<IEnumerable<UrlRow>> Search(IEnumerable<string> tokens)
    {
        const int limit = 10;
        return await _dbConnection.QueryAsync<UrlRow>(
            "select urls.url, sum(u.count) as rating from urls join usage as u on urls.id = u.url join tokens as t on u.token = t.id where t.token in @tokens order by rating desc limit @limit",
            new {limit = limit, tokens = tokens}
            );
    }
    
    public async Task UpsertToken(string url, string token, int count)
    {
        var transaction = await _dbConnection.BeginTransactionAsync();
        try
        {
            int url_id = await _dbConnection.QuerySingleAsync<int>(
                "select id from urls where url = @url;",
                new { url },
                transaction);
            int? token_id = await _dbConnection.QuerySingleOrDefaultAsync<int?>(
                "select id from tokens where token = @token;",
                new { token },
                transaction);
            token_id ??= await AddToken(token);
            
            _logger.LogTrace("Token {token} has id {id}", token, token_id);
            await Task.Delay(10);
            
            await _dbConnection.ExecuteAsync(
                "insert into usage (url, token, count) values (@url_id, @token_id, @count) on conflict (url, token) do update set count = excluded.count;",
                new { url_id, token_id, count },
                transaction
            );   
                
            await transaction.CommitAsync();
        }
        catch(Exception ex)
        {
            _logger.LogError(ex, "Transcation error");
            await transaction.RollbackAsync();
        }
    }

    public async Task<IEnumerable<string>> ListUrls()
    {
        var result = await _dbConnection.QueryAsync<string>(
            "Select url from urls;");

        var listUrls = result as string[] ?? result.ToArray();
        var count = listUrls.Count();
        _logger.LogInformation("Found {count} urls.", count);
        return listUrls;
    }

    public void Dispose()
    {
        _dbConnection.Close();
        _dbConnection.Dispose();
    }

    public async ValueTask DisposeAsync()
    {
        await _dbConnection.CloseAsync();
        await _dbConnection.DisposeAsync();
    }
}