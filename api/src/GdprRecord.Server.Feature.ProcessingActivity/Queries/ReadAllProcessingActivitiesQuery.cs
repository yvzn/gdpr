using GdprRecord.Server.Feature.ProcessingActivity.Infrastructure;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace GdprRecord.Server.Feature.ProcessingActivity.Queries;

public record ReadAllProcessingActivitiesQuery : IQuery<ReadAllProcessingActivitiesResponse>;

public record ReadAllProcessingActivitiesResponse(ICollection<ProcessingActivityItem> ProcessingActivities);

public record ProcessingActivityItem(
	int Id,
	string? Description,
	string? Reference,
	DateTimeOffset? Created,
	DateTimeOffset? Updated);

public class ReadAllProcessingActivitiesQueryHandler(
	ProcessingActivityContext database
	) : IQueryHandler<ReadAllProcessingActivitiesQuery, ReadAllProcessingActivitiesResponse>
{
	public async ValueTask<Result<ReadAllProcessingActivitiesResponse>> Handle(ReadAllProcessingActivitiesQuery query, CancellationToken cancellationToken)
	{
		var processingActivities = await database.ProcessingActivities
			.AsNoTracking()
			.ToListAsync(cancellationToken);

		return new ReadAllProcessingActivitiesResponse(
			processingActivities.Adapt<ICollection<ProcessingActivityItem>>());
	}
}
