using GdprRecord.Server.Feature.Organization.Infrastructure;
using Mapster;
using Microsoft.Extensions.Logging;

namespace GdprRecord.Server.Feature.Organization.Commands;

public record CreatePersonResponse(int Id);

public record CreatePersonCommand(
	string? FullName,
	string? Address,
	string? City,
	string? ZipCode,
	string? Email,
	string? Phone,
	string? Company
	) : ICommand<CreatePersonResponse>;

public class CreatePersonCommandHandler(
	OrganizationContext database,
	ILogger<CreatePersonCommandHandler> logger
	) : ICommandHandler<CreatePersonCommand, CreatePersonResponse>
{
	public async ValueTask<Result<CreatePersonResponse>> Handle(CreatePersonCommand command, CancellationToken cancellationToken)
	{
		try
		{
			var newPerson = command.Adapt<Model.Person>();
			await database.People.AddAsync(newPerson, cancellationToken);

			await database.SaveChangesAsync(cancellationToken);

			return new CreatePersonResponse(newPerson.Id);
		}
		catch (Exception ex)
		{
			logger.LogError(ex, "Creating person {PersonName}", command.FullName);
			return Error.Conflict;
		}
	}
}
