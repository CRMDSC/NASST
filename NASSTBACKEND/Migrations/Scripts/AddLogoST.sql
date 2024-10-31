BEGIN TRANSACTION;
GO

ALTER TABLE [UserRefreshTokens] DROP CONSTRAINT [FK_UserRefreshTokens_AspNetUsers_UserId];
GO

DECLARE @var0 sysname;
SELECT @var0 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserRefreshTokens]') AND [c].[name] = N'UserId');
IF @var0 IS NOT NULL EXEC(N'ALTER TABLE [UserRefreshTokens] DROP CONSTRAINT [' + @var0 + '];');
ALTER TABLE [UserRefreshTokens] ALTER COLUMN [UserId] nvarchar(450) NULL;
GO

DECLARE @var1 sysname;
SELECT @var1 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[UserRefreshTokens]') AND [c].[name] = N'Token');
IF @var1 IS NOT NULL EXEC(N'ALTER TABLE [UserRefreshTokens] DROP CONSTRAINT [' + @var1 + '];');
ALTER TABLE [UserRefreshTokens] ALTER COLUMN [Token] nvarchar(70) NULL;
GO

ALTER TABLE [SportTypes] ADD [LogoUrl] nvarchar(max) NULL;
GO

ALTER TABLE [UserRefreshTokens] ADD CONSTRAINT [FK_UserRefreshTokens_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241030062645_AddLogoST', N'8.0.8');
GO

COMMIT;
GO

