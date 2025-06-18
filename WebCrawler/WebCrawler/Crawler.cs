using System.Text.RegularExpressions;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.ML.Tokenizers;

namespace WebCrawler;

public class Crawler : BackgroundService
{
    private readonly HttpClient _client;
    private static readonly Regex AhrefRegex = new("(href=[\"'])(.*?)([\"'])");
    private static readonly Regex CleanHtmlRegex = new("<[^>]+?>");
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
        url = url.Split('?')[0]; // Trim of Queries
        var baseUrl = $"https://{url.Replace("https://", "").Replace("http://", "").Split('/').FirstOrDefault()!}";
        var response = await _client.GetAsync(url);
        var contentHeaders = response.Content.Headers;
        var contentType = contentHeaders.FirstOrDefault(h => h.Key == "Content-Type").Value.FirstOrDefault();

        if (contentType == null || !contentType.Contains("text/html"))
        {
            _logger.LogError("Crawler found content type : \"{contentType}\". Won't check again soon.", contentType);
            return new CrawlResult
            {
                Url = url,
                LastChecked = DateTime.Now + TimeSpan.FromDays(365),
                ChildLinks = [baseUrl],
            };
        }

        var content = await response.Content.ReadAsStringAsync();
        IEnumerable<string> matches = AhrefRegex.Matches(content)
            .Select(m => m.Groups[2].Value)
            .Select(link =>
            {
                link = link.Split('?')[0]; // Trim of Queries

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
            Content = CleanHtmlRegex.Replace(content, string.Empty),
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

            await Task.Delay(1, stoppingToken);

            foreach (var url in urls)
            {
                if (stoppingToken.IsCancellationRequested)
                {
                    _logger.LogInformation("Cancellation requested, stopping crawl for: {url}", url);
                    break;
                }

                _logger.LogInformation("Crawling : {url}", url);
                var lastChecked = await _database.UrlLastChecked(url);

                if (DateTime.Now - lastChecked < TimeSpan.FromDays(5))
                {
                    _logger.LogDebug("Already checked {url} recently.", url);
                    continue;
                }

                try
                {
                    var info = await CrawlOnce(url);
                    await _database.UpsertUrl(url, info.LastChecked, info.Content);

                    await ProcessContent(url, info.Content);

                    foreach (var childLink in info.ChildLinks)
                    {
                        if (stoppingToken.IsCancellationRequested) break;
                        await _database.UpsertUrl(childLink);
                    }
                }
                catch (OperationCanceledException)
                {
                    _logger.LogInformation("Crawling operation was canceled for {url}.", url);
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error crawling {url}", url);
                }
            }

            if (stoppingToken.IsCancellationRequested)
            {
                break;
            }

        }

        _logger.LogInformation("Crawler Service has stopped.");
    }

    private async Task ProcessContent(string url, string content)
    {
        _logger.LogInformation("Processing {url}...", url);
        /*
        const string modelName = "gpt-4o";
        Tokenizer tokenizer = TiktokenTokenizer.CreateForModel(modelName);
        
        IReadOnlyList<(int t, int c)> tokens = tokenizer
            .EncodeToIds(content)
            .GroupBy(item => item)
            .Select(group => (tokenizer.Decode([group.Key]), group.Count()))
            .ToList();
        */
        IReadOnlyList<(string t, int c)> tokens = content.Split([' ', '-', '\n'])
            .Select(s => s.Replace(".", "")
                                .Replace(",", "")
                                .Replace("!", "")
                                .Replace("?", "")
                                .Replace("(", "")
                                .Replace(")", "")
                                .Replace(":", "")
                                .Replace(";", "")
                                .Replace("'", "")
                                .Replace("\"", "")
                                .Replace("{", "")
                                .Replace("}", "")
                                .Replace("+", "")
                                .Replace("@", "")
            )
            .Select(s => s.ToLowerInvariant())
            .Select(s => s.Trim())
            .GroupBy(item => item)
            .Select(group => (group.Key, group.Count()))
            .ToList();
        foreach (var token in tokens)
        {
            _logger.LogTrace("Word Token : {t}", token.t);
            await _database.UpsertToken(url, token.t, token.c);
        }
    }
}