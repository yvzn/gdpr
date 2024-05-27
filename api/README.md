# README

TODO

## EntityFramework migrations

Update database

```pwsh
dotnet ef database update --project .\GdprRecord.Server.Feature.Organization\
```

Recreate database

```pwsh
dotnet ef database drop --project .\GdprRecord.Server.Feature.Organization\
```

Create migration

```pwsh
dotnet ef migrations add <<name>> --project .\GdprRecord.Server.Feature.Organization\
```

List all migrations

```pwsh
dotnet ef migrations list --project .\GdprRecord.Feature.Organization\
```
