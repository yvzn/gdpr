using GdprRecord.Server.Feature.Organization.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace GdprRecord.Server.Feature.Organization.Queries;

internal record ReadPersonQuery(int Id) : IQuery<Model.Person>;

internal class ReadPersonQueryHandler(OrganizationContext database) : IQueryHandler<ReadPersonQuery, Model.Person>
{
	public async ValueTask<Result<Model.Person>> Handle(ReadPersonQuery request, CancellationToken cancellationToken)
	{
		var person = await database.People
			.AsNoTracking()
			.FirstOrDefaultAsync(o => o.Id == request.Id, cancellationToken);
		if (person is null)
		{
			return Error.NotFound;
		}
		return person;
	}
}
