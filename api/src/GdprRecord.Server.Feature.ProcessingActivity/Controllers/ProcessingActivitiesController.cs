using GdprRecord.Server.Feature.ProcessingActivity.Commands;
using GdprRecord.Server.Feature.ProcessingActivity.Queries;
using Mediator;
using Microsoft.AspNetCore.Mvc;

namespace GdprRecord.Server.Feature.ProcessingActivity.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProcessingActivitiesController(IMediator mediator) : ControllerBase
{
	[HttpGet]
	public async Task<IActionResult> ReadAllProcessingActivities()
	{
		var response = await mediator.Send(new ReadAllProcessingActivitiesQuery());

		return response.Match<IActionResult>(
			failure: _ => NotFound(),
			success: Ok);
	}

	[HttpPost]
	public async Task<IActionResult> CreateProcessingActivity(
		[FromBody] CreateProcessingActivityCommand createProcessingActivityCommand)
	{
		var response = await mediator.Send(createProcessingActivityCommand);

		return response.Match<IActionResult>(
			failure: _ => Conflict(),
			success: created => Created($"/api/ProcessingActivities/{created.Id}", default));
	}
}
