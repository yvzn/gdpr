using FluentValidation;

namespace GdprRecord.Server.Feature.Organization.Commands;

public class CreateOrUpdatePersonValidator : AbstractValidator<CreateOrUpdatePersonCommand>
{
	public CreateOrUpdatePersonValidator()
	{
		RuleFor(x => x.Id).GreaterThanOrEqualTo(1);
	}
}
