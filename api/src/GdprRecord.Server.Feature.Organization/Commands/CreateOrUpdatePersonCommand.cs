using GdprRecord.Server.Feature.Organization.Infrastructure;
using Mapster;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace GdprRecord.Server.Feature.Organization.Commands;

public abstract record CreateOrUpdatePersonResponse(int Id);

public record PersonCreated(int Id): CreateOrUpdatePersonResponse(Id);
public record PersonUpdated(int Id): CreateOrUpdatePersonResponse(Id);

public record CreateOrUpdatePersonCommand(
	int Id,
	string? FullName,
	string? Address,
	string? City,
	string? ZipCode,
	string? Email,
	string? Phone,
	string? Company
	) : ICommand<CreateOrUpdatePersonResponse>;

internal class CreateOrUpdatePersonCommandHandler(
	OrganizationContext database,
	ILogger<CreateOrUpdatePersonCommandHandler> logger
	) : ICommandHandler<CreateOrUpdatePersonCommand, CreateOrUpdatePersonResponse>
{
	public async Task<Result<CreateOrUpdatePersonResponse>> Handle(CreateOrUpdatePersonCommand command, CancellationToken cancellationToken)
	{
		using var transaction = await database.Database.BeginTransactionAsync(cancellationToken);

		try
		{
			Func<int> PersonId = () => command.Id;

			var existingPerson = await database.People
				.FirstOrDefaultAsync(o => o.Id == command.Id, cancellationToken);

			if (existingPerson is null)
			{
				var newPerson = command.Adapt<Model.Person>();
				await database.People.AddAsync(newPerson, cancellationToken);
				PersonId = () => newPerson.Id;
			}
			else
			{
				command.Adapt(existingPerson);
			}

			await database.SaveChangesAsync(cancellationToken);

			await transaction.CommitAsync(cancellationToken);

			return existingPerson is null
				? new PersonCreated(PersonId())
				: new PersonUpdated(PersonId());
		}
		catch (Exception ex)
		{
			logger.LogError(ex, "Updating person {PersonId}", command.Id);
			await transaction.RollbackAsync(cancellationToken);
			return Error.Conflict;
		}
	}
}
