using GdprRecord.Server.Feature.ProcessingActivity.Infrastructure;
using GdprRecord.Server.Feature.ProcessingActivity.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace GdprRecord.Server.Feature.ProcessingActivity.Commands;

public record UpdateProcessingActivityResponse(int Id);

public record UpdateProcessingActivityCommand(
	int Id,
	string? Description,
	string? Reference,
	ICollection<UpdatePurposeDto> Purposes,
	ICollection<UpdatePersonalDataDto> CategoriesOfPersonalData,
	ICollection<UpdateDataSubjectDto> CategoriesOfDataSubjects,
	ICollection<UpdateSensitiveDataDto> CategoriesOfSensitiveData,
	ICollection<UpdateRecipientDto> Recipients,
	ICollection<UpdateInternationalRecipientDto> InternationalRecipients,
	ICollection<UpdateSecurityMeasureDto> SecurityMeasures
	) : ICommand<UpdateProcessingActivityResponse>;

public record UpdatePurposeDto(int Id, string? Description);

public record UpdatePersonalDataDto(int Id, string? Description, string? StoragePeriod);

public record UpdateSensitiveDataDto(int Id, string? Description, string? StoragePeriod);

public record UpdateDataSubjectDto(int Id, string? Type, string? Description);

public record UpdateRecipientDto(int Id, string? Type, string? Description);

public record UpdateInternationalRecipientDto(
	int Id,
	string? Description,
	string? Country,
	ICollection<string> Guarantees,
	string? Documentation);

public record UpdateSecurityMeasureDto(int Id, string? Type, string? Description);

public class UpdateProcessingActivityCommandHandler(
	ProcessingActivityContext database,
	ILogger<UpdateProcessingActivityCommandHandler> logger
	) : ICommandHandler<UpdateProcessingActivityCommand, UpdateProcessingActivityResponse>
{
	public async ValueTask<Result<UpdateProcessingActivityResponse>> Handle(
		UpdateProcessingActivityCommand command, CancellationToken cancellationToken)
	{
		using var transaction = await database.Database.BeginTransactionAsync(cancellationToken);

		try
		{
			var activity = await database.ProcessingActivities
				.Include(a => a.Purposes)
				.Include(a => a.CategoriesOfPersonalData)
				.Include(a => a.CategoriesOfDataSubjects)
				.Include(a => a.CategoriesOfSensitiveData)
				.Include(a => a.Recipients)
				.Include(a => a.InternationalRecipients)
				.Include(a => a.SecurityMeasures)
				.FirstOrDefaultAsync(a => a.Id == command.Id, cancellationToken);

			if (activity is null)
			{
				logger.LogError("Cannot update processing activity {Id} (not found)", command.Id);
				await transaction.RollbackAsync(cancellationToken);
				return Error.NotFound;
			}

			activity.Description = command.Description;
			activity.Reference = command.Reference;
			activity.Updated = DateTimeOffset.UtcNow;

			SyncPurposes(activity, command.Purposes);
			SyncPersonalData(activity, command.CategoriesOfPersonalData);
			SyncSensitiveData(activity, command.CategoriesOfSensitiveData);
			SyncDataSubjects(activity, command.CategoriesOfDataSubjects);
			SyncRecipients(activity, command.Recipients);
			SyncInternationalRecipients(activity, command.InternationalRecipients);
			SyncSecurityMeasures(activity, command.SecurityMeasures);

			await database.SaveChangesAsync(cancellationToken);
			await transaction.CommitAsync(cancellationToken);

			return new UpdateProcessingActivityResponse(activity.Id);
		}
		catch (Exception ex)
		{
			logger.LogError(ex, "Updating processing activity {Id}", command.Id);
			await transaction.RollbackAsync(cancellationToken);
			return Error.Conflict;
		}
	}

	private static void SyncPurposes(Model.ProcessingActivity activity, ICollection<UpdatePurposeDto> incoming)
	{
		var incomingIds = incoming.Where(i => i.Id > 0).Select(i => i.Id).ToHashSet();
		var toRemove = activity.Purposes.Where(e => !incomingIds.Contains(e.Id)).ToList();
		foreach (var item in toRemove) activity.Purposes.Remove(item);

		foreach (var dto in incoming)
		{
			if (dto.Id > 0)
			{
				var existing = activity.Purposes.FirstOrDefault(e => e.Id == dto.Id);
				if (existing is not null) existing.Description = dto.Description;
			}
			else
			{
				activity.Purposes.Add(new Purpose { Description = dto.Description, ProcessingActivityId = activity.Id });
			}
		}
	}

	private static void SyncPersonalData(Model.ProcessingActivity activity, ICollection<UpdatePersonalDataDto> incoming)
	{
		var incomingIds = incoming.Where(i => i.Id > 0).Select(i => i.Id).ToHashSet();
		var toRemove = activity.CategoriesOfPersonalData.Where(e => !incomingIds.Contains(e.Id)).ToList();
		foreach (var item in toRemove) activity.CategoriesOfPersonalData.Remove(item);

		foreach (var dto in incoming)
		{
			if (dto.Id > 0)
			{
				var existing = activity.CategoriesOfPersonalData.FirstOrDefault(e => e.Id == dto.Id);
				if (existing is not null) { existing.Description = dto.Description; existing.StoragePeriod = dto.StoragePeriod; }
			}
			else
			{
				activity.CategoriesOfPersonalData.Add(new PersonalData { Description = dto.Description, StoragePeriod = dto.StoragePeriod, ProcessingActivityId = activity.Id });
			}
		}
	}

	private static void SyncSensitiveData(Model.ProcessingActivity activity, ICollection<UpdateSensitiveDataDto> incoming)
	{
		var incomingIds = incoming.Where(i => i.Id > 0).Select(i => i.Id).ToHashSet();
		var toRemove = activity.CategoriesOfSensitiveData.Where(e => !incomingIds.Contains(e.Id)).ToList();
		foreach (var item in toRemove) activity.CategoriesOfSensitiveData.Remove(item);

		foreach (var dto in incoming)
		{
			if (dto.Id > 0)
			{
				var existing = activity.CategoriesOfSensitiveData.FirstOrDefault(e => e.Id == dto.Id);
				if (existing is not null) { existing.Description = dto.Description; existing.StoragePeriod = dto.StoragePeriod; }
			}
			else
			{
				activity.CategoriesOfSensitiveData.Add(new SensitiveData { Description = dto.Description, StoragePeriod = dto.StoragePeriod, ProcessingActivityId = activity.Id });
			}
		}
	}

	private static void SyncDataSubjects(Model.ProcessingActivity activity, ICollection<UpdateDataSubjectDto> incoming)
	{
		var incomingIds = incoming.Where(i => i.Id > 0).Select(i => i.Id).ToHashSet();
		var toRemove = activity.CategoriesOfDataSubjects.Where(e => !incomingIds.Contains(e.Id)).ToList();
		foreach (var item in toRemove) activity.CategoriesOfDataSubjects.Remove(item);

		foreach (var dto in incoming)
		{
			if (dto.Id > 0)
			{
				var existing = activity.CategoriesOfDataSubjects.FirstOrDefault(e => e.Id == dto.Id);
				if (existing is not null) { existing.Type = dto.Type; existing.Description = dto.Description; }
			}
			else
			{
				activity.CategoriesOfDataSubjects.Add(new DataSubject { Type = dto.Type, Description = dto.Description, ProcessingActivityId = activity.Id });
			}
		}
	}

	private static void SyncRecipients(Model.ProcessingActivity activity, ICollection<UpdateRecipientDto> incoming)
	{
		var incomingIds = incoming.Where(i => i.Id > 0).Select(i => i.Id).ToHashSet();
		var toRemove = activity.Recipients.Where(e => !incomingIds.Contains(e.Id)).ToList();
		foreach (var item in toRemove) activity.Recipients.Remove(item);

		foreach (var dto in incoming)
		{
			if (dto.Id > 0)
			{
				var existing = activity.Recipients.FirstOrDefault(e => e.Id == dto.Id);
				if (existing is not null) { existing.Type = dto.Type; existing.Description = dto.Description; }
			}
			else
			{
				activity.Recipients.Add(new Recipient { Type = dto.Type, Description = dto.Description, ProcessingActivityId = activity.Id });
			}
		}
	}

	private static void SyncInternationalRecipients(Model.ProcessingActivity activity, ICollection<UpdateInternationalRecipientDto> incoming)
	{
		var incomingIds = incoming.Where(i => i.Id > 0).Select(i => i.Id).ToHashSet();
		var toRemove = activity.InternationalRecipients.Where(e => !incomingIds.Contains(e.Id)).ToList();
		foreach (var item in toRemove) activity.InternationalRecipients.Remove(item);

		foreach (var dto in incoming)
		{
			if (dto.Id > 0)
			{
				var existing = activity.InternationalRecipients.FirstOrDefault(e => e.Id == dto.Id);
				if (existing is not null)
				{
					existing.Description = dto.Description;
					existing.Country = dto.Country;
					existing.Guarantees = dto.Guarantees;
					existing.Documentation = dto.Documentation;
				}
			}
			else
			{
				activity.InternationalRecipients.Add(new InternationalRecipient
				{
					Description = dto.Description,
					Country = dto.Country,
					Guarantees = dto.Guarantees,
					Documentation = dto.Documentation,
					ProcessingActivityId = activity.Id,
				});
			}
		}
	}

	private static void SyncSecurityMeasures(Model.ProcessingActivity activity, ICollection<UpdateSecurityMeasureDto> incoming)
	{
		var incomingIds = incoming.Where(i => i.Id > 0).Select(i => i.Id).ToHashSet();
		var toRemove = activity.SecurityMeasures.Where(e => !incomingIds.Contains(e.Id)).ToList();
		foreach (var item in toRemove) activity.SecurityMeasures.Remove(item);

		foreach (var dto in incoming)
		{
			if (dto.Id > 0)
			{
				var existing = activity.SecurityMeasures.FirstOrDefault(e => e.Id == dto.Id);
				if (existing is not null) { existing.Type = dto.Type; existing.Description = dto.Description; }
			}
			else
			{
				activity.SecurityMeasures.Add(new SecurityMeasure { Type = dto.Type, Description = dto.Description, ProcessingActivityId = activity.Id });
			}
		}
	}
}
