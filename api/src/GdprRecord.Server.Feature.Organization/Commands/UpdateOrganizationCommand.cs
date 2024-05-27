using AutoMapper;
using GdprRecord.Server.Feature.Organization.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace GdprRecord.Server.Feature.Organization.Commands;

public record UpdateOrganizationResponse(int Id);

public record UpdateOrganizationCommand(
	int Id,
	string? Name,
	int? ControllerId,
	int? JointControllerId,
	int? ControllersRepresentativeId,
	int? DataProtectionOfficerId) : ICommand<UpdateOrganizationResponse>;

internal class CreateOrUpdateOrganizationCommandHandler(
	OrganizationContext database,
	IMapper mapper,
	ILogger<CreateOrUpdateOrganizationCommandHandler> logger
	) : ICommandHandler<UpdateOrganizationCommand, UpdateOrganizationResponse>
{
	public async Task<Result<UpdateOrganizationResponse>> Handle(UpdateOrganizationCommand command, CancellationToken cancellationToken)
	{
		using var transaction = await database.Database.BeginTransactionAsync(cancellationToken);

		try
		{
			var existingOrganization = await database.Organizations
				.FirstOrDefaultAsync(o => o.Id == command.Id, cancellationToken);

			if (existingOrganization is null)
			{
				logger.LogError("Cannot update organization {OrganizationId} (not found)", command.Id);
				await transaction.RollbackAsync(cancellationToken);
				return Error.NotFound;
			}

			mapper.Map(command, existingOrganization);

			await database.SaveChangesAsync(cancellationToken);

			await transaction.CommitAsync(cancellationToken);

			return new UpdateOrganizationResponse(command.Id);
		}
		catch (Exception ex)
		{
			logger.LogError(ex, "Updating organization {OrganizationId}", command.Id);
			await transaction.RollbackAsync(cancellationToken);
			return Error.Conflict;
		}
	}
}
