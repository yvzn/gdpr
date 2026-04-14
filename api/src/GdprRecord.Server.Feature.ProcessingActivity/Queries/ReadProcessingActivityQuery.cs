using GdprRecord.Server.Feature.ProcessingActivity.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace GdprRecord.Server.Feature.ProcessingActivity.Queries;

public record ReadProcessingActivityQuery(int Id) : IQuery<ReadProcessingActivityResponse>;

public record ReadProcessingActivityResponse(
	int Id,
	string? Description,
	string? Reference,
	DateTimeOffset? Created,
	DateTimeOffset? Updated,
	ICollection<PurposeDto> Purposes,
	ICollection<PersonalDataDto> CategoriesOfPersonalData,
	ICollection<DataSubjectDto> CategoriesOfDataSubjects,
	ICollection<SensitiveDataDto> CategoriesOfSensitiveData,
	ICollection<RecipientDto> Recipients,
	ICollection<InternationalRecipientDto> InternationalRecipients,
	ICollection<SecurityMeasureDto> SecurityMeasures);

public record PurposeDto(int Id, string? Description);

public record PersonalDataDto(int Id, string? Description, string? StoragePeriod);

public record SensitiveDataDto(int Id, string? Description, string? StoragePeriod);

public record DataSubjectDto(int Id, string? Type, string? Description);

public record RecipientDto(int Id, string? Type, string? Description);

public record InternationalRecipientDto(
	int Id,
	string? Description,
	string? Country,
	ICollection<string> Guarantees,
	string? Documentation);

public record SecurityMeasureDto(int Id, string? Type, string? Description);

public class ReadProcessingActivityQueryHandler(
	ProcessingActivityContext database
	) : IQueryHandler<ReadProcessingActivityQuery, ReadProcessingActivityResponse>
{
	public async ValueTask<Result<ReadProcessingActivityResponse>> Handle(
		ReadProcessingActivityQuery request, CancellationToken cancellationToken)
	{
		var activity = await database.ProcessingActivities
			.AsNoTracking()
			.Include(a => a.Purposes)
			.Include(a => a.CategoriesOfPersonalData)
			.Include(a => a.CategoriesOfDataSubjects)
			.Include(a => a.CategoriesOfSensitiveData)
			.Include(a => a.Recipients)
			.Include(a => a.InternationalRecipients)
			.Include(a => a.SecurityMeasures)
			.FirstOrDefaultAsync(a => a.Id == request.Id, cancellationToken);

		if (activity is null)
		{
			return Error.NotFound;
		}

		return new ReadProcessingActivityResponse(
			activity.Id,
			activity.Description,
			activity.Reference,
			activity.Created,
			activity.Updated,
			activity.Purposes.Select(p => new PurposeDto(p.Id, p.Description)).ToList(),
			activity.CategoriesOfPersonalData.Select(p => new PersonalDataDto(p.Id, p.Description, p.StoragePeriod)).ToList(),
			activity.CategoriesOfDataSubjects.Select(d => new DataSubjectDto(d.Id, d.Type, d.Description)).ToList(),
			activity.CategoriesOfSensitiveData.Select(s => new SensitiveDataDto(s.Id, s.Description, s.StoragePeriod)).ToList(),
			activity.Recipients.Select(r => new RecipientDto(r.Id, r.Type, r.Description)).ToList(),
			activity.InternationalRecipients.Select(i => new InternationalRecipientDto(i.Id, i.Description, i.Country, i.Guarantees, i.Documentation)).ToList(),
			activity.SecurityMeasures.Select(m => new SecurityMeasureDto(m.Id, m.Type, m.Description)).ToList());
	}
}
