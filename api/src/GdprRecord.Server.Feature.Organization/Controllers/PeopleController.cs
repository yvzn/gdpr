using GdprRecord.Server.Feature.Organization.Commands;
using GdprRecord.Server.Feature.Organization.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace GdprRecord.Server.Feature.Organization.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PeopleController(IMediator mediator) : ControllerBase
{
	[HttpGet]
	public async Task<IActionResult> ReadAllPeople()
	{
		var response = await mediator.Send(new ReadAllPeopleQuery());

		return response.Match<IActionResult>(
			failure: _ => NotFound(),
			success: Ok);
	}

	[HttpGet]
	[Route("{id:int}")]
	public async Task<IActionResult> ReadPerson(int id)
	{
		var response = await mediator.Send(new ReadPersonQuery(id));

		return response.Match<IActionResult>(
			failure: _ => NotFound(),
			success: Ok);
	}

	[HttpPut]
	[Route("{id:int}")]
	public async Task<IActionResult> CreateOrUpdatePerson(
		int id,
		[FromBody] CreateOrUpdatePersonCommand createOrUpdatePersonCommand)
	{
		if (id != createOrUpdatePersonCommand.Id)
		{
			return BadRequest();
		}

		var response = await mediator.Send(createOrUpdatePersonCommand);

		return response.Match<IActionResult>(
			failure: _ => Conflict(),
			success: result => result is PersonCreated created
						? CreatedAtAction(nameof(ReadPerson), new { id = created.Id }, default)
						: NoContent());
	}

	[HttpPost]
	public async Task<IActionResult> CreatePerson(
		[FromBody] CreatePersonCommand createPersonCommand)
	{
		var response = await mediator.Send(createPersonCommand);

		return response.Match<IActionResult>(
			failure: _ => Conflict(),
			success: created => CreatedAtAction(nameof(ReadPerson), new { id = created.Id }, default));
	}
}
