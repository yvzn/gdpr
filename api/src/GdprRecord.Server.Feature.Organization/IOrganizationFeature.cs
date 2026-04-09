using FluentValidation;
using FluentValidation.AspNetCore;
using GdprRecord.Server.Feature.Organization.Infrastructure;
using Mapster;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Mediator;

namespace GdprRecord.Server.Feature.Organization;

public interface IOrganizationFeature { }

public static class IServicesCollectionExtensions
{
	public static IServiceCollection AddOrganizationFeature(this IServiceCollection services)
	{
		TypeAdapterConfig.GlobalSettings.Scan(typeof(IOrganizationFeature).Assembly);

		services.AddControllers()
			.AddApplicationPart(typeof(IOrganizationFeature).Assembly);

		services.AddFluentValidationAutoValidation();
		services.AddValidatorsFromAssemblyContaining<IOrganizationFeature>();

		services.AddDbContext<OrganizationContext>(
			options => options.UseSqlite($"Data Source={OrganizationContext.DbPath}"));

		services.AddScoped<OrganizationDbInitializer>();

		return services;
	}
}

public static class IHostExtensions
{
	public static IHost UseOrganizationFeature(this IHost app)
	{
		using var scope = app.Services.CreateScope();

		var serviceProvider = scope.ServiceProvider;
		var dbInitializer = serviceProvider.GetRequiredService<OrganizationDbInitializer>();

		dbInitializer.Init().GetAwaiter().GetResult();

		return app;
	}
}
