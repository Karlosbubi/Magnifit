using System.Text.RegularExpressions;

namespace WebCrawler;

public class Crawler
{
    private readonly HttpClient _client;
    private static readonly Regex AhrefRegex = new("/<a\\s+(?:[^>]*?\\s+)?href=([\"'])(.*?)\\1");

    public Crawler(HttpClient? client = null)
    {
        _client = client ?? new HttpClient();
    }

    public async Task<CrawlResult> CrawlOnce(string url)
    {
        var baseUrl = url.Replace("https://", "").Replace("http://", "").Split('/').FirstOrDefault();
        
        var response = await _client.GetAsync(url);
        var contentHeaders = response.Content.Headers;

        var contentType = contentHeaders.FirstOrDefault(h => h.Key == "Content-Type").Value.FirstOrDefault();

        if (contentType == null || !contentType.Contains("text/html")) {
            throw new Exception("Not a Web Page");
        }

        var content = await response.Content.ReadAsStringAsync();
        
        foreach (var match in AhrefRegex.Matches(content))
        {
            Console.WriteLine(match);
        }

        var matches = AhrefRegex.Matches(content).Select(m => m.Groups[1].Value);
        
        return new CrawlResult
        {
            Url = url,
            LastChecked = DateTime.Now,
            ChildLinks = matches,
            //Content = content,
        };
    }
}