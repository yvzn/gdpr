
using AutoMapper;

namespace GdprRecord.Server.Feature.Organization.Queries;

internal class ReadAllOrganizationsMapperProfile : Profile
{
	public ReadAllOrganizationsMapperProfile(): base()
	{
		CreateMap<Model.Organization, Organization>();
	}
}
