using Mapster;

namespace GdprRecord.Server.Feature.Organization.Commands;

public class CreateOrUpdatePersonMapperProfile : IRegister
{
	public void Register(TypeAdapterConfig config)
	{
		config.NewConfig<CreatePersonCommand, Model.Person>();
		config.NewConfig<CreateOrUpdatePersonCommand, Model.Person>();
	}
}
