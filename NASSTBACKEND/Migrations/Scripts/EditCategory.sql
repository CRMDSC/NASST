BEGIN TRANSACTION;
GO

ALTER TABLE [Category] ADD [IsArchived] bit NOT NULL DEFAULT CAST(0 AS bit);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241021072702_EditCategory', N'8.0.8');
GO

COMMIT;
GO

