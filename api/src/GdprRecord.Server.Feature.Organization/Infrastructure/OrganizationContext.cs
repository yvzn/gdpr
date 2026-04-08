using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace GdprRecord.Server.Feature.Organization.Infrastructure;

using Model;

public class OrganizationContext(DbContextOptions<OrganizationContext> options) : DbContext(options)
{
	public DbSet<Organization> Organizations { get; set; }
	public DbSet<Person> People { get; set; }

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		modelBuilder.Entity<Organization>()
			.ToTable(nameof(Organization));

		modelBuilder.Entity<Person>()
			.ToTable(nameof(Person));
	}

	public static string DbPath
		=> Path.Join(DbDirectory, $"{nameof(Organization)}.db");

	public static string DbDirectory
		=> Path.Join(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "GdprRecord");
}

public class OrganizationContextFactory : IDesignTimeDbContextFactory<OrganizationContext>
{
	public OrganizationContext CreateDbContext(string[] args)
	{
		Directory.CreateDirectory(OrganizationContext.DbDirectory);

		var optionsBuilder = new DbContextOptionsBuilder<OrganizationContext>();
		optionsBuilder.UseSqlite($"Data Source={OrganizationContext.DbPath}");

		return new OrganizationContext(optionsBuilder.Options);
	}
}
