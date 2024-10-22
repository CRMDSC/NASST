BEGIN TRANSACTION;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241021091700_PasswordNullable', N'8.0.8');
GO

COMMIT;
GO

