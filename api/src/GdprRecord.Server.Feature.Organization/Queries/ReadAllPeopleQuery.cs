
using GdprRecord.Server.Feature.Organization.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace GdprRecord.Server.Feature.Organization.Queries;

public record ReadAllPeopleQuery : IQuery<ReadAllPeopleResponse>;

public record ReadAllPeopleResponse(ICollection<Model.Person> People);

public class ReadAllPeopleQueryHandler(OrganizationContext database) : IQueryHandler<ReadAllPeopleQuery, ReadAllPeopleResponse>
{
	public async ValueTask<Result<ReadAllPeopleResponse>> Handle(ReadAllPeopleQuery query, CancellationToken cancellationToken)
	{
		var people = await database.People
			.AsNoTracking()
			.ToListAsync(cancellationToken);
		return new ReadAllPeopleResponse(people);
	}
}
