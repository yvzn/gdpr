using GdprRecord.Server.Feature.Organization.Infrastructure;
using Mapster;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace GdprRecord.Server.Feature.Organization.Commands;

public record UpdatePersonResponse(int Id);

public record UpdatePersonCommand(
	int Id,
	string? FullName,
	string? Address,
	string? City,
	string? ZipCode,
	string? Email,
	string? Phone,
	string? Company
	) : ICommand<UpdatePersonResponse>;

internal class UpdatePersonCommandHandler(
	OrganizationContext database,
	ILogger<UpdatePersonCommandHandler> logger
	) : ICommandHandler<UpdatePersonCommand, UpdatePersonResponse>
{
	public async ValueTask<Result<UpdatePersonResponse>> Handle(UpdatePersonCommand command, CancellationToken cancellationToken)
	{
		using var transaction = await database.Database.BeginTransactionAsync(cancellationToken);

		try
		{
			var existingPerson = await database.People
				.FirstOrDefaultAsync(o => o.Id == command.Id, cancellationToken);

			if (existingPerson is null)
			{
				logger.LogError("Cannot update person {PersonId} (not found)", command.Id);
				await transaction.RollbackAsync(cancellationToken);
				return Error.NotFound;
			}

			command.Adapt(existingPerson);

			await database.SaveChangesAsync(cancellationToken);

			await transaction.CommitAsync(cancellationToken);

			return new UpdatePersonResponse(command.Id);
		}
		catch (Exception ex)
		{
			logger.LogError(ex, "Updating person {PersonId}", command.Id);
			await transaction.RollbackAsync(cancellationToken);
			return Error.Conflict;
		}
	}
}
