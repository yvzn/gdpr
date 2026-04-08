namespace GdprRecord.Server.Feature.ProcessingActivity.Model;

public class ProcessingActivity
{
	public int Id { get; set; }
	public string? Description { get; set; }
	public string? Reference { get; set; }
	public DateTimeOffset? Created { get; set; }
	public DateTimeOffset? Updated { get; set; }
	// public int? ControllerId { get; set; }
	// public int? ControllersRepresentativeId {get; set; }
	// public int? JointControllerId {get; set; }
	// public int? DataProtectionOfficerId {get; set; }
	public ICollection<Purpose> Purposes { get; set; } = [];
	public ICollection<PersonalData> CategoriesOfPersonalData { get; set; } = [];
	public ICollection<DataSubject> CategoriesOfDataSubjects { get; set; } = [];
	public ICollection<SensitiveData> CategoriesOfSensitiveData { get; set; } = [];
	public ICollection<Recipient> Recipients { get; set; } = [];
	public ICollection<InternationalRecipient> InternationalRecipients { get; set; } = [];
	public ICollection<SecurityMeasure> SecurityMeasures { get; set; } = [];
}

public class Purpose: HasProcessActivity
{
	public int Id { get; set; }
	public string? Description { get; set; }
}

public class PersonalData: PersonalDataCategory { }

public class SensitiveData: PersonalDataCategory { }

public class PersonalDataCategory: HasProcessActivity
{
	public int Id { get; set; }
	public string? Description { get; set; }
	public string? StoragePeriod { get; set; }
}

public class DataSubject: HasProcessActivity
{
	public int Id { get; set; }
	public string? Type { get; set; }
	public string? Description { get; set; }
}

public class Recipient: HasProcessActivity
{
	public int Id { get; set; }
	public string? Type { get; set; }
	public string? Description { get; set; }
}

public class InternationalRecipient: HasProcessActivity
{
	public int Id { get; set; }
	public string? Description { get; set; }
	public string? Country { get; set; }
	public ICollection<string> Guarantees { get; set; } = [];
	public string? Documentation { get; set; }
}

public class SecurityMeasure: HasProcessActivity
{
	public int Id { get; set; }
	public string? Type { get; set; }
	public string? Description { get; set; }
}

public class HasProcessActivity
{
	public int ProcessingActivityId { get; set; }
}
