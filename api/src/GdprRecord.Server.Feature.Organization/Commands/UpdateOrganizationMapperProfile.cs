using Mapster;
using GdprRecord.Server.Feature.Organization.Queries;

namespace GdprRecord.Server.Feature.Organization.Commands;

public class UpdateOrganizationMapperProfile : IRegister
{
	public void Register(TypeAdapterConfig config)
	{
		config.NewConfig<UpdateOrganizationCommand, Model.Organization>()
			.IgnoreIf((src, dest) => !IsValidPersonId(src.ControllerId), dest => dest.ControllerId)
			.IgnoreIf((src, dest) => !IsValidPersonId(src.JointControllerId), dest => dest.JointControllerId)
			.IgnoreIf((src, dest) => !IsValidPersonId(src.ControllersRepresentativeId), dest => dest.ControllersRepresentativeId)
			.IgnoreIf((src, dest) => !IsValidPersonId(src.DataProtectionOfficerId), dest => dest.DataProtectionOfficerId);

		config.NewConfig<Model.Organization, ReadOrganizationResponse>();
	}

	private static bool IsValidPersonId(int? maybeId)
		=> maybeId.HasValue && maybeId.Value > 0;
}
