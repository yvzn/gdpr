using GdprRecord.Server.Feature.Organization.Infrastructure;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace GdprRecord.Server.Feature.Organization.Queries;

internal record ReadOrganizationQuery(int Id) : IQuery<ReadOrganizationResponse>;

public record ReadOrganizationResponse(
	int Id,
	string? Name,
	int? ControllerId,
	int? JointControllerId,
	int? ControllersRepresentativeId,
	int? DataProtectionOfficerId);

internal class ReadOrganizationQueryHandler(
	OrganizationContext database
	) : IQueryHandler<ReadOrganizationQuery, ReadOrganizationResponse>
{
	public async Task<Result<ReadOrganizationResponse>> Handle(ReadOrganizationQuery request, CancellationToken cancellationToken)
	{
		var organization = await database.Organizations
			.AsNoTracking()
			.FirstOrDefaultAsync(o => o.Id == request.Id, cancellationToken);
		if (organization is null)
		{
			return Error.NotFound;
		}
		return organization.Adapt<ReadOrganizationResponse>();
	}
}
