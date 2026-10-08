using System.Globalization;
using GdprRecord.Server.Feature.Organization.Infrastructure;
using GdprRecord.Server.Feature.Organization.Model;
using GdprRecord.Server.Feature.ProcessingActivity.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace GdprRecord.Server;

internal sealed class DemoModeResetMiddleware(
	RequestDelegate next,
	ILogger<DemoModeResetMiddleware> logger)
{
	private static readonly SemaphoreSlim ResetLock = new(1, 1);
	private static readonly string MarkerPath = Path.Combine(
		OrganizationContext.DefaultDbDirectory,
		"demo-mode-last-reset.txt");
	private static readonly string LockPath = Path.Combine(
		OrganizationContext.DefaultDbDirectory,
		"demo-mode-reset.lock");

	public async Task InvokeAsync(
		HttpContext context,
		IServiceScopeFactory serviceScopeFactory)
	{
		await ResetLock.WaitAsync(context.RequestAborted);
		try
		{
			Directory.CreateDirectory(OrganizationContext.DefaultDbDirectory);
			await using var resetFileLock = await AcquireResetFileLockAsync(context.RequestAborted);

			var today = DateOnly.FromDateTime(DateTime.UtcNow);
			var previousReset = await ReadLastResetDayAsync(context.RequestAborted);
			if (previousReset == today)
			{
				logger.LogInformation(
					"Demo data reset skipped for {ResetDay}: reset already completed for this UTC day.",
					today);
			}
			else
			{
				var reason = previousReset is null
					? "no valid previous reset date was found"
					: $"the previous reset was on {previousReset:yyyy-MM-dd}";
				logger.LogInformation(
					"Demo data reset starting for {ResetDay}: {Reason}.",
					today,
					reason);

				await ResetDataAsync(serviceScopeFactory, context.RequestAborted);
				await WriteLastResetDayAsync(today, context.RequestAborted);

				logger.LogInformation(
					"Demo data reset completed for {ResetDay}.",
					today);
			}
		}
		finally
		{
			ResetLock.Release();
		}

		await next(context);
	}

	private static async Task<FileStream> AcquireResetFileLockAsync(
		CancellationToken cancellationToken)
	{
		while (true)
		{
			cancellationToken.ThrowIfCancellationRequested();
			try
			{
				return new FileStream(LockPath, FileMode.OpenOrCreate, FileAccess.ReadWrite, FileShare.None);
			}
			catch (IOException)
			{
				await Task.Delay(TimeSpan.FromMilliseconds(100), cancellationToken);
			}
		}
	}

	private static async Task<DateOnly?> ReadLastResetDayAsync(CancellationToken cancellationToken)
	{
		if (!File.Exists(MarkerPath))
		{
			return null;
		}

		var marker = await File.ReadAllTextAsync(MarkerPath, cancellationToken);
		return DateOnly.TryParseExact(
			marker.Trim(),
			"yyyy-MM-dd",
			CultureInfo.InvariantCulture,
			DateTimeStyles.None,
			out var resetDay)
				? resetDay
				: null;
	}

	private static async Task WriteLastResetDayAsync(
		DateOnly resetDay,
		CancellationToken cancellationToken)
	{
		var temporaryPath = $"{MarkerPath}.tmp";
		await File.WriteAllTextAsync(
			temporaryPath,
			resetDay.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
			cancellationToken);
		File.Move(temporaryPath, MarkerPath, overwrite: true);
	}

	private static async Task ResetDataAsync(
		IServiceScopeFactory serviceScopeFactory,
		CancellationToken cancellationToken)
	{
		await using var scope = serviceScopeFactory.CreateAsyncScope();
		var organizationContext = scope.ServiceProvider.GetRequiredService<OrganizationContext>();
		var processingActivityContext = scope.ServiceProvider.GetRequiredService<ProcessingActivityContext>();

		await using (var transaction = await organizationContext.Database.BeginTransactionAsync(cancellationToken))
		{
			await organizationContext.Organizations
				.Where(organization => organization.Id != 1)
				.ExecuteDeleteAsync(cancellationToken);

			var preservedOrganizationCount = await organizationContext.Organizations
				.Where(organization => organization.Id == 1)
				.ExecuteUpdateAsync(
					updates => updates
						.SetProperty(organization => organization.Name, "Default organization")
						.SetProperty(organization => organization.ControllerId, (int?)null)
						.SetProperty(organization => organization.JointControllerId, (int?)null)
						.SetProperty(organization => organization.ControllersRepresentativeId, (int?)null)
						.SetProperty(organization => organization.DataProtectionOfficerId, (int?)null),
					cancellationToken);

			await organizationContext.People.ExecuteDeleteAsync(cancellationToken);

			if (preservedOrganizationCount == 0)
			{
				await organizationContext.Organizations.AddAsync(
					new Organization { Id = 1, Name = "Default organization" },
					cancellationToken);
				await organizationContext.SaveChangesAsync(cancellationToken);
			}

			await transaction.CommitAsync(cancellationToken);
		}

		await using (var transaction = await processingActivityContext.Database.BeginTransactionAsync(cancellationToken))
		{
			await processingActivityContext.ProcessingActivities.ExecuteDeleteAsync(cancellationToken);
			await transaction.CommitAsync(cancellationToken);
		}
	}
}
