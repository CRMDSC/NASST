# NASST


SQL DETAILS:
- to add a migration
dotnet ef migrations Add "Migration name"
- to script a migration
dotnet ef migrations script "OldMigrationName" -o "C:\dev\NASST\NASST\NASSTBACKEND\Migrations\Scripts\NewMigrationName.sql"