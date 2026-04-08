using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace GdprRecord.Server.Feature.ProcessingActivity.Infrastructure;

using Model;

public class ProcessingActivityContext(DbContextOptions<ProcessingActivityContext> options) : DbContext(options)
{
	public DbSet<ProcessingActivity> ProcessingActivities { get; set; }
	public DbSet<Purpose> Purposes { get; set; }
	public DbSet<PersonalData> PersonalData { get; set; }
	public DbSet<SensitiveData> SensitiveData { get; set; }
	public DbSet<DataSubject> DataSubjects { get; set; }
	public DbSet<Recipient> Recipients { get; set; }
	public DbSet<InternationalRecipient> InternationalRecipients { get; set; }
	public DbSet<SecurityMeasure> SecurityMeasures { get; set; }

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		modelBuilder.Entity<ProcessingActivity>()
			.ToTable(nameof(ProcessingActivity));

		modelBuilder.Entity<Purpose>()
			.ToTable(nameof(Purpose));

		modelBuilder.Entity<PersonalData>()
			.ToTable(nameof(PersonalData));

		modelBuilder.Entity<SensitiveData>()
			.ToTable(nameof(SensitiveData));

		modelBuilder.Entity<DataSubject>()
			.ToTable(nameof(DataSubject));

		modelBuilder.Entity<Recipient>()
			.ToTable(nameof(Recipient));

		modelBuilder.Entity<InternationalRecipient>()
			.ToTable(nameof(InternationalRecipient));

		modelBuilder.Entity<SecurityMeasure>()
			.ToTable(nameof(SecurityMeasure));
	}

	public static string DbPath
		=> Path.Join(DbDirectory, $"{nameof(ProcessingActivity)}.db");

	public static string DbDirectory
		=> Path.Join(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "GdprRecord");
}

public class ProcessingActivityContextFactory : IDesignTimeDbContextFactory<ProcessingActivityContext>
{
	public ProcessingActivityContext CreateDbContext(string[] args)
	{
		Directory.CreateDirectory(ProcessingActivityContext.DbDirectory);

		var optionsBuilder = new DbContextOptionsBuilder<ProcessingActivityContext>();
		optionsBuilder.UseSqlite($"Data Source={ProcessingActivityContext.DbPath}");

		return new ProcessingActivityContext(optionsBuilder.Options);
	}
}
