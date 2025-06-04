using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Serilog;
using Serilog.Extensions.Logging;
using ILogger = Microsoft.Extensions.Logging.ILogger;

namespace WebCrawler;

public class Program
{
    private static string TestUrl = "https://www.dhbw-heidenheim.de";

    static async Task Main(string[] args)
    {
        Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Information()
            .WriteTo.Console()
            .CreateLogger();

        var builder = Host.CreateApplicationBuilder(args);
        builder.Services
            .AddSerilog()
            //.AddSingleton<DbInfo>(_ => new DbInfo("Data Source=../../../crawler.db"))
            //.AddSingleton<IDatabase, SqliteConnector>()
            .AddSingleton<DbInfo>(_ => new DbInfo(
                "Host=127.0.0.1;Port=5433;Database=postgres;Username=root;Password=secret_password"))
            .AddSingleton<IDatabase, PostgresConnector>()
            .AddHostedService<Crawler>();
        
        var host = builder.Build();
        
        await host.RunAsync();
        
        Log.CloseAndFlush();
        
    }
}

public record DbInfo(string ConnectionString)
{
    public override string ToString()
    {
        return $"{{ ConnectionString = {ConnectionString} }}";
    }
}
