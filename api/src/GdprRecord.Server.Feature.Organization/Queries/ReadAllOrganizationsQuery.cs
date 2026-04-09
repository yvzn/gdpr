using GdprRecord.Server.Feature.Organization.Infrastructure;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace GdprRecord.Server.Feature.Organization.Queries;

public record ReadAllOrganizationsQuery : IQuery<ReadAllOrganizationsResponse>;

public record ReadAllOrganizationsResponse(ICollection<Organization> Organizations);

public record Organization(
	int Id,
	string? Name,
	int? ControllerId,
	int? JointControllerId,
	int? ControllersRepresentativeId,
	int? DataProtectionOfficerId);

public class ReadAllOrganizationsQueryHandler(
	OrganizationContext database
	) : IQueryHandler<ReadAllOrganizationsQuery, ReadAllOrganizationsResponse>
{
	public async ValueTask<Result<ReadAllOrganizationsResponse>> Handle(ReadAllOrganizationsQuery query, CancellationToken cancellationToken)
	{
		var organizations = await database.Organizations
			.AsNoTracking()
			.ToListAsync(cancellationToken);

		return new ReadAllOrganizationsResponse(
			organizations.Adapt<ICollection<Organization>>());
	}
}
