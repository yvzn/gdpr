using AutoMapper;

namespace GdprRecord.Server.Feature.Organization.Queries;

internal class ReadOrganizationMapperProfile : Profile
{
	public ReadOrganizationMapperProfile() : base()
	{
		CreateMap<Model.Organization, ReadAllOrganizationsResponse>();
	}
}
