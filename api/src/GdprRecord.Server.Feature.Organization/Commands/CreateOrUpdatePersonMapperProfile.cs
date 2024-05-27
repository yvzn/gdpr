using AutoMapper;

namespace GdprRecord.Server.Feature.Organization.Commands;

public class CreateOrUpdatePersonMapperProfile : Profile
{
	public CreateOrUpdatePersonMapperProfile() : base()
	{
		CreateMap<CreatePersonCommand, Model.Person>();
		CreateMap<CreateOrUpdatePersonCommand, Model.Person>();
	}
}
