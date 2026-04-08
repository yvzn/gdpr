# README

TODO

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
