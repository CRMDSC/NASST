BEGIN TRANSACTION;
GO

DECLARE @var0 sysname;
SELECT @var0 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SportDocumentTypes]') AND [c].[name] = N'DocumentLink');
IF @var0 IS NOT NULL EXEC(N'ALTER TABLE [SportDocumentTypes] DROP CONSTRAINT [' + @var0 + '];');
ALTER TABLE [SportDocumentTypes] DROP COLUMN [DocumentLink];
GO

DECLARE @var1 sysname;
SELECT @var1 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SportAdditionalInformation]') AND [c].[name] = N'InformationValue');
IF @var1 IS NOT NULL EXEC(N'ALTER TABLE [SportAdditionalInformation] DROP CONSTRAINT [' + @var1 + '];');
ALTER TABLE [SportAdditionalInformation] DROP COLUMN [InformationValue];
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241028043508_EditSportTypes', N'8.0.8');
GO

COMMIT;
GO

