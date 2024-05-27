using GdprRecord.Server.Feature.Organization.Commands;
using GdprRecord.Server.Feature.Organization.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace GdprRecord.Server.Feature.Organization.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrganizationsController(IMediator mediator) : ControllerBase
{
	[HttpGet]
	public async Task<IActionResult> ReadAllOrganizations()
	{
		var response = await mediator.Send(new ReadAllOrganizationsQuery());

		return response.Match<IActionResult>(
			failure: _ => NotFound(),
			success: Ok);
	}

	[HttpGet]
	[Route("{id:int}")]
	public async Task<IActionResult> ReadOrganization(int id)
	{
		var response = await mediator.Send(new ReadOrganizationQuery(id));

		return response.Match<IActionResult>(
			failure: _ => NotFound(),
			success: Ok);
	}

	[HttpPut]
	[Route("{id:int}")]
	public async Task<IActionResult> UpdateOrganization(
		int id,
		[FromBody] UpdateOrganizationCommand updateOrganizationCommand)
	{
		if (id != updateOrganizationCommand.Id)
		{
			return BadRequest();
		}

		var response = await mediator.Send(updateOrganizationCommand);

		return response.Match<IActionResult>(
			failure: error => error is Error.NotFound ? NotFound() : Conflict(),
			success: _ => NoContent());
	}
}
