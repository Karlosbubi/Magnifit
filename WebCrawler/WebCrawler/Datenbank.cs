namespace WebCrawler;

public interface IDatabase
{
    public void Initalize();
    public Task<DateTime> UrlLastChecked(string url);
    
    public Task UpsertUrl(string url, DateTime? lastChecked = null, string? content = null);
    
    public Task<IEnumerable<string>> ListUrls();
}