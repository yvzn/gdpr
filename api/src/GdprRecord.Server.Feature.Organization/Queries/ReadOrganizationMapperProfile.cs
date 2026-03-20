using Mapster;

namespace GdprRecord.Server.Feature.Organization.Queries;

internal class ReadOrganizationMapperProfile : IRegister
{
	public void Register(TypeAdapterConfig config)
	{
		config.NewConfig<Model.Organization, ReadAllOrganizationsResponse>();
	}
}
