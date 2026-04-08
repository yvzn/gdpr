using GdprRecord.Server.Feature.ProcessingActivity.Infrastructure;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace GdprRecord.Server.Feature.ProcessingActivity.Queries;

internal record ReadAllProcessingActivitiesQuery : IQuery<ReadAllProcessingActivitiesResponse>;

internal record ReadAllProcessingActivitiesResponse(ICollection<ProcessingActivityItem> ProcessingActivities);

internal record ProcessingActivityItem(
	int Id,
	string? Description,
	string? Reference,
	DateTimeOffset? Created,
	DateTimeOffset? Updated);

internal class ReadAllProcessingActivitiesQueryHandler(
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
