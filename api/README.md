# README

TODO

## Database connection strings

The API uses one SQLite database for each feature. The databases are stored in `%LOCALAPPDATA%/GdprRecord/` by default. Add required connection strings to `appsettings.json` to override the default database locations:

```json
{
	"ConnectionStrings": {
		"OrganizationDb": "Data Source=C:/data/GdprRecord/Organization.db",
		"ProcessingActivityDb": "Data Source=C:/data/GdprRecord/ProcessingActivity.db"
	}
}
```

## EntityFramework migrations

Install EntityFramework tools

```pwsh
dotnet tool restore
```

Update database

```pwsh
dotnet ef database update --project .\src\GdprRecord.Server.Feature.Organization\
```

Recreate database

```pwsh
dotnet ef database drop --project .\src\GdprRecord.Server.Feature.Organization\
```

Create migration

```pwsh
dotnet ef migrations add <<name>> --project .\src\GdprRecord.Server.Feature.Organization\
```

List all migrations

```pwsh
dotnet ef migrations list --project .\src\GdprRecord.Server.Feature.Organization\
```
