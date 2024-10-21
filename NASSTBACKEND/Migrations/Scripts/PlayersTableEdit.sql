BEGIN TRANSACTION;
GO

ALTER TABLE [Players] ADD [Email] nvarchar(max) NULL;
GO

ALTER TABLE [Players] ADD [PhoneNumber] nvarchar(max) NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241021093852_PlayersTableEdit', N'8.0.8');
GO

COMMIT;
GO

