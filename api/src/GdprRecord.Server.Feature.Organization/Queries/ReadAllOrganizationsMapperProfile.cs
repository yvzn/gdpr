using Mapster;

namespace GdprRecord.Server.Feature.Organization.Queries;

internal class ReadAllOrganizationsMapperProfile : IRegister
{
	public void Register(TypeAdapterConfig config)
	{
		config.NewConfig<Model.Organization, Organization>();
	}
}
