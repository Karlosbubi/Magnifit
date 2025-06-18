namespace WebCrawler;

public interface IDatabase
{
    public void Initalize();
    public Task<DateTime> UrlLastChecked(string url);
    
    public Task UpsertUrl(string url, DateTime? lastChecked = null, string? content = null, string? title = null);

    public Task UpsertToken(string url, string token, int count);
    
    public Task<IEnumerable<string>> ListUrls();
}