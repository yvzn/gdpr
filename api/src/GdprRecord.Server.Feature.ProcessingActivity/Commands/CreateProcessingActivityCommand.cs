using GdprRecord.Server.Feature.ProcessingActivity.Infrastructure;
using Microsoft.Extensions.Logging;

namespace GdprRecord.Server.Feature.ProcessingActivity.Commands;

public record CreateProcessingActivityResponse(int Id);

public record CreateProcessingActivityCommand(
	string? Description,
	string? Reference
	) : ICommand<CreateProcessingActivityResponse>;

internal class CreateProcessingActivityCommandHandler(
	ProcessingActivityContext database,
	ILogger<CreateProcessingActivityCommandHandler> logger
	) : ICommandHandler<CreateProcessingActivityCommand, CreateProcessingActivityResponse>
{
	public async ValueTask<Result<CreateProcessingActivityResponse>> Handle(CreateProcessingActivityCommand command, CancellationToken cancellationToken)
	{
		try
		{
			var now = DateTimeOffset.UtcNow;
			var newProcessingActivity = new Model.ProcessingActivity
			{
				Description = command.Description,
				Reference = command.Reference,
				Created = now,
				Updated = now,
			};

			await database.ProcessingActivities.AddAsync(newProcessingActivity, cancellationToken);
			await database.SaveChangesAsync(cancellationToken);

			return new CreateProcessingActivityResponse(newProcessingActivity.Id);
		}
		catch (Exception ex)
		{
			logger.LogError(ex, "Creating processing activity {ProcessingActivityReference}", command.Reference);
			return Error.Conflict;
		}
	}
}
