using AutoMapper;
using GdprRecord.Server.Feature.Organization.Queries;

namespace GdprRecord.Server.Feature.Organization.Commands;

public class UpdateOrganizationMapperProfile : Profile
{
	public UpdateOrganizationMapperProfile()
	{
		CreateMap<UpdateOrganizationCommand, Model.Organization>()
			.ForMember(dest => dest.ControllerId, opt => opt.Condition(src => IsValidPersonId(src.ControllerId)))
			.ForMember(dest => dest.JointControllerId, opt => opt.Condition(src => IsValidPersonId(src.JointControllerId)))
			.ForMember(dest => dest.ControllersRepresentativeId, opt => opt.Condition(src => IsValidPersonId(src.ControllersRepresentativeId)))
			.ForMember(dest => dest.DataProtectionOfficerId, opt => opt.Condition(src => IsValidPersonId(src.DataProtectionOfficerId)));

		static bool IsValidPersonId(int? maybeId)
			=> maybeId.HasValue && maybeId.Value > 0;

		CreateMap<Model.Organization, ReadOrganizationResponse>();
	}
}
