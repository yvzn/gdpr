
using GdprRecord.Server.Feature.Organization.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace GdprRecord.Server.Feature.Organization.Queries;

internal record ReadAllPeopleQuery : IQuery<ReadAllPeopleResponse>;

internal record ReadAllPeopleResponse(ICollection<Model.Person> People);

internal class ReadAllPeopleQueryHandler(OrganizationContext database) : IQueryHandler<ReadAllPeopleQuery, ReadAllPeopleResponse>
{
	public async Task<Result<ReadAllPeopleResponse>> Handle(ReadAllPeopleQuery query, CancellationToken cancellationToken)
	{
		var people = await database.People
			.AsNoTracking()
			.ToListAsync(cancellationToken);
		return new ReadAllPeopleResponse(people);
	}
}
