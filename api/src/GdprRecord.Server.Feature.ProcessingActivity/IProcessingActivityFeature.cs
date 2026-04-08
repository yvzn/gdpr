using FluentValidation;
using FluentValidation.AspNetCore;
using GdprRecord.Server.Feature.ProcessingActivity.Infrastructure;
using Mapster;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Mediator;

namespace GdprRecord.Server.Feature.ProcessingActivity;

public interface IProcessingActivityFeature { }

public static class IServicesCollectionExtensions
{
	public static IServiceCollection AddProcessingActivityFeature(this IServiceCollection services)
	{
		services.AddMediator(options => options.ServiceLifetime = ServiceLifetime.Scoped);

		TypeAdapterConfig.GlobalSettings.Scan(typeof(IProcessingActivityFeature).Assembly);

		services.AddControllers()
			.AddApplicationPart(typeof(IProcessingActivityFeature).Assembly);

		services.AddFluentValidationAutoValidation();
		services.AddValidatorsFromAssemblyContaining<IProcessingActivityFeature>();

		services.AddDbContext<ProcessingActivityContext>(
			options => options.UseSqlite($"Data Source={ProcessingActivityContext.DbPath}"));

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
