using AutoMapper;
using GdprRecord.Server.Feature.Organization.Infrastructure;
using Microsoft.Extensions.Logging;

namespace GdprRecord.Server.Feature.Organization.Commands;

public record CreatePersonResponse(int Id) : PersonCreated(Id);

public record CreatePersonCommand(
	string? FullName,
	string? Address,
	string? City,
	string? ZipCode,
	string? Email,
	string? Phone,
	string? Company
	) : ICommand<CreatePersonResponse>;

internal class CreatePersonCommandHandler(
	OrganizationContext database,
	IMapper mapper,
	ILogger<CreatePersonCommandHandler> logger
	) : ICommandHandler<CreatePersonCommand, CreatePersonResponse>
{
	public async Task<Result<CreatePersonResponse>> Handle(CreatePersonCommand command, CancellationToken cancellationToken)
	{
		try
		{
			var newPerson = mapper.Map<Model.Person>(command);
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
