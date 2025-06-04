using System.Text.RegularExpressions;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace WebCrawler;

public class Crawler : BackgroundService
{
    private readonly HttpClient _client;
    private static readonly Regex AhrefRegex = new("(href=[\"'])(.*?)([\"'])");
    private readonly IDatabase _database;
    private readonly ILogger<Crawler> _logger;

    public Crawler(IDatabase database, ILogger<Crawler> logger, HttpClient? client = null)
    {
        _database = database;
        _logger = logger;
        _client = client ?? new HttpClient();
    }

    public async Task<CrawlResult> CrawlOnce(string url)
    {
        var baseUrl = $"https://{url.Replace("https://", "").Replace("http://", "").Split('/').FirstOrDefault()!}";
        var response = await _client.GetAsync(url);
        var contentHeaders = response.Content.Headers;
        var contentType = contentHeaders.FirstOrDefault(h => h.Key == "Content-Type").Value.FirstOrDefault();
        
        if (contentType == null || !contentType.Contains("text/html")) {
            _logger.LogError("Crawler found content type : \"{contentType}\". Won't check again soon.", contentType);
            return new CrawlResult
            {
                Url = url,
                LastChecked = DateTime.Now + TimeSpan.FromDays(30),
                ChildLinks = [baseUrl],
            };
        }
        
        var content = await response.Content.ReadAsStringAsync();
        IEnumerable<string> matches = AhrefRegex.Matches(content).Select(m => m.Groups[2].Value).Select(link =>
            {
                if (link.StartsWith("https://") || link.StartsWith("http://"))
                {
                    return link;
                }

                if (link.StartsWith('/'))
                {
                    return $"{baseUrl}{link}";
                }
                
                return null;
            }
        ).Where(m => m != null)!;
        matches = matches.Append(baseUrl);
        
        return new CrawlResult
        {
            Url = url,
            LastChecked = DateTime.Now,
            ChildLinks = matches,
            Content = content,
        };
    }
    
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Crawler Service is starting.");
        _database.Initalize();
        _logger.LogInformation("Database initialized");
        
        stoppingToken.Register(() =>
            _logger.LogInformation("Crawler Service is stopping."));

        while (!stoppingToken.IsCancellationRequested)
        {
            _logger.LogDebug("Crawling...");
            var urls = await _database.ListUrls();

            await Parallel.ForEachAsync(urls, stoppingToken, async (url, cancellationToken) =>
                //foreach (var url in urls)
            {
                if (cancellationToken.IsCancellationRequested)
                {
                    _logger.LogInformation("Cancellation requested, stopping crawl for: {url}", url);
                    return; //break;
                }

                _logger.LogInformation("Crawling : {url}", url);
                var lastChecked = await _database.UrlLastChecked(url);

                if (DateTime.Now - lastChecked < TimeSpan.FromMinutes(5))
                {
                    _logger.LogDebug("Already checked {url} recently.", url);
                    //continue;
                    return;
                }

                try
                {
                    var info = await CrawlOnce(url);
                    await _database.UpsertUrl(url, info.LastChecked, info.Content);

                    foreach (var childLink in info.ChildLinks)
                    {
                        if (cancellationToken.IsCancellationRequested) break;
                        await _database.UpsertUrl(childLink);
                    }
                }
                catch (OperationCanceledException)
                {
                    _logger.LogInformation("Crawling operation was canceled for {url}.", url);
                    return;  //break;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error crawling {url}", url);
                }
            });

            if (stoppingToken.IsCancellationRequested)
            {
                break;
            }
            try
            {
                await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken);
            }
            catch (OperationCanceledException)
            {
                _logger.LogInformation("Delay was canceled, stopping service.");
                break;
            }
        }

        _logger.LogInformation("Crawler Service has stopped.");
    }
}