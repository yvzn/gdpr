namespace GdprRecord.Server.Feature.ProcessingActivity;

public class ProcessingActivity
{
	public int Id { get; set; }
	public string? Description { get; set; }
	public string? Reference { get; set; }
	public DateTimeOffset? Created { get; set; }
	public DateTimeOffset? Updated { get; set; }
	public IEnumerable<string> Purposes { get; set; } = [];
	public IEnumerable<PersonalData> CategoriesOfPersonalData { get; set; } = [];
	public IEnumerable<string> CategoriesOfDataSubjects { get; set; } = [];
	public IEnumerable<PersonalData> CategoriesOfSensitiveData { get; set; } = [];
	public IEnumerable<Recipient> Recipients { get; set; } = [];
	public IEnumerable<InternationalRecipient> InternationalRecipients { get; set; } = [];
	public IEnumerable<string> SecurityMeasures { get; set; } = [];
}

public class PersonalData
{
	public int Id { get; set; }
	public int ProcessingActivityId { get; set; }
	public string? Description { get; set; }
	public TimeSpan? StoragePeriod { get; set; }
}

public class Recipient
{
	public int Id { get; set; }
	public int ProcessingActivityId { get; set; }
	public string? Name { get; set; }
	public string? Description { get; set; }
}

public class InternationalRecipient
{
	public int Id { get; set; }
	public int ProcessingActivityId { get; set; }
	public string? Name { get; set; }
	public string? Description { get; set; }
	public string? Country { get; set; }
	public IEnumerable<string> Guarantees { get; set; } = [];
}
