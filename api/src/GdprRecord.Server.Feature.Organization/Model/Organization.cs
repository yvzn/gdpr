namespace GdprRecord.Server.Feature.Organization.Model;

public class Organization
{
	public int Id { get; set; }
	public string? Name { get; set; }
	public int? ControllerId { get; set; }
	public Person? Controller { get; set; }
	public int? JointControllerId {get; set; }
	public Person? JointController { get; set; }
	public int? ControllersRepresentativeId {get; set; }
	public Person? ControllersRepresentative { get; set; }
	public int? DataProtectionOfficerId {get; set; }
	public Person? DataProtectionOfficer { get; set; }
}

public class Person
{
	public int Id { get; set; }
	public string? FullName { get; set; }
	public string? Address { get; set; }
	public string? City { get; set; }
	public string? ZipCode { get; set; }
	public string? Email { get; set; }
	public string? Phone { get; set; }
	// if distinct from Organization
	public string? Company { get; set; }
}
