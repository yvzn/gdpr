using GdprRecord.Server.Feature.Organization.Model;
using Microsoft.EntityFrameworkCore;

namespace GdprRecord.Server.Feature.Organization.Infrastructure;

internal class OrganizationDbInitializer(OrganizationContext context)
{
	internal async Task Init(CancellationToken cancellationToken = default)
	{
		Directory.CreateDirectory(OrganizationContext.DbDirectory);

		await context.Database.MigrateAsync(cancellationToken);
		await context.Database.EnsureCreatedAsync(cancellationToken);

		if (context.Organizations.Any())
		{
			return;
		}

		var defaultOrganization = new Model.Organization
		{
			Id = 1,
			Name = "Default organization"
		};

		await context.Organizations.AddAsync(defaultOrganization, cancellationToken);
		await context.SaveChangesAsync(cancellationToken);
	}
}
