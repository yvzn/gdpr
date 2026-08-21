using FluentValidation;
using FluentValidation.AspNetCore;
using GdprRecord.Server.Feature.ProcessingActivity.Infrastructure;
using Mapster;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Mediator;

namespace GdprRecord.Server.Feature.ProcessingActivity;

public interface IProcessingActivityFeature { }

public static class IServicesCollectionExtensions
{
	public static IServiceCollection AddProcessingActivityFeature(this IServiceCollection services, IConfiguration configuration)
	{
		TypeAdapterConfig.GlobalSettings.Scan(typeof(IProcessingActivityFeature).Assembly);

		var connectionString = configuration.GetConnectionString("ProcessingActivityDb");
		if (string.IsNullOrWhiteSpace(connectionString))
		{
			Directory.CreateDirectory(ProcessingActivityContext.DefaultDbDirectory);
			connectionString = $"Data Source={ProcessingActivityContext.DefaultDbPath}";
		}

		services.AddControllers()
			.AddApplicationPart(typeof(IProcessingActivityFeature).Assembly);

		services.AddFluentValidationAutoValidation();
		services.AddValidatorsFromAssemblyContaining<IProcessingActivityFeature>();

		services.AddDbContext<ProcessingActivityContext>(
			options => options.UseSqlite(connectionString));

		services.AddScoped<ProcessingActivityDbInitializer>();

		return services;
	}
}

public static class IHostExtensions
{
	public static IHost UseProcessingActivityFeature(this IHost app)
	{
		using var scope = app.Services.CreateScope();

		var serviceProvider = scope.ServiceProvider;
		var dbInitializer = serviceProvider.GetRequiredService<ProcessingActivityDbInitializer>();

		dbInitializer.Init().GetAwaiter().GetResult();

		return app;
	}
}
