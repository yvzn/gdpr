using Microsoft.EntityFrameworkCore;

namespace GdprRecord.Server.Feature.ProcessingActivity.Infrastructure;

internal class ProcessingActivityDbInitializer(ProcessingActivityContext context)
{
	internal async Task Init(CancellationToken cancellationToken = default)
	{
		Directory.CreateDirectory(ProcessingActivityContext.DbDirectory);

		await context.Database.MigrateAsync(cancellationToken);
		await context.Database.EnsureCreatedAsync(cancellationToken);
	}
}
