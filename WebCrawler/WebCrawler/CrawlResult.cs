namespace WebCrawler;

public record CrawlResult
{
    public required string Url;
    public required DateTime LastChecked;
    public required IEnumerable<string> ChildLinks;
    public string Content = "";
    public string? Title = null;
}