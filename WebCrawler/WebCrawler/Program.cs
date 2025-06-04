namespace WebCrawler;

class Program
{
    static async Task Main(string[] args)
    {
        Crawler crawler = new Crawler();

        var testUrl = "https://www.dhbw-heidenheim.de";
        
        var res = await crawler.CrawlOnce(testUrl);
        
        Console.WriteLine(res);
        
        foreach (var item in res.ChildLinks)
        {
            Console.WriteLine(item);
        }
    }
}