namespace WebCrawler.DbModels;

public struct UrlRow
{
    public int Id { get; set; }
    public string Url { get; set; }
    public DateTime LastChecked { get; set; }
    public string? Content { get; set; }
}