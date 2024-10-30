BEGIN TRANSACTION;
GO

ALTER TABLE [SportPlayersCategories] ADD [IsArchived] bit NOT NULL DEFAULT CAST(0 AS bit);
GO

ALTER TABLE [SportDocumentTypes] ADD [IsArchived] bit NOT NULL DEFAULT CAST(0 AS bit);
GO

ALTER TABLE [SportAdditionalInformation] ADD [IsArchived] bit NOT NULL DEFAULT CAST(0 AS bit);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241023041611_EditInfoDoc', N'8.0.8');
GO

COMMIT;
GO

