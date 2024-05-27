
using AutoMapper;
using GdprRecord.Server.Feature.Organization.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace GdprRecord.Server.Feature.Organization.Queries;

internal record ReadAllOrganizationsQuery : IQuery<ReadAllOrganizationsResponse>;

internal record ReadAllOrganizationsResponse(ICollection<Organization> Organizations);

internal record Organization(
	int Id,
	string? Name,
	int? ControllerId,
	int? JointControllerId,
	int? ControllersRepresentativeId,
	int? DataProtectionOfficerId);

internal class ReadAllOrganizationsQueryHandler(
	OrganizationContext database,
	IMapper mapper
	) : IQueryHandler<ReadAllOrganizationsQuery, ReadAllOrganizationsResponse>
{
	public async Task<Result<ReadAllOrganizationsResponse>> Handle(ReadAllOrganizationsQuery query, CancellationToken cancellationToken)
	{
		var organizations = await database.Organizations
			.AsNoTracking()
			.ToListAsync(cancellationToken);

		return new ReadAllOrganizationsResponse(
			mapper.Map<ICollection<Organization>>(organizations));
	}
}
