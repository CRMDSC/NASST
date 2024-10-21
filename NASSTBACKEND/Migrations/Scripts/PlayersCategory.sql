BEGIN TRANSACTION;
GO

ALTER TABLE [AspNetUsers] DROP CONSTRAINT [FK_AspNetUsers_Category_CategoryId];
GO

DROP INDEX [IX_AspNetUsers_CategoryId] ON [AspNetUsers];
GO

DECLARE @var0 sysname;
SELECT @var0 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[AspNetUsers]') AND [c].[name] = N'CategoryId');
IF @var0 IS NOT NULL EXEC(N'ALTER TABLE [AspNetUsers] DROP CONSTRAINT [' + @var0 + '];');
ALTER TABLE [AspNetUsers] DROP COLUMN [CategoryId];
GO

CREATE TABLE [PlayersCategories] (
    [UserId] nvarchar(450) NOT NULL,
    [CategoryId] int NOT NULL,
    CONSTRAINT [FK_PlayersCategories_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_PlayersCategories_Category_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [Category] ([Id]) ON DELETE CASCADE
);
GO

CREATE INDEX [IX_PlayersCategories_CategoryId] ON [PlayersCategories] ([CategoryId]);
GO

CREATE INDEX [IX_PlayersCategories_UserId] ON [PlayersCategories] ([UserId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241021090944_PlayersCategories', N'8.0.8');
GO

COMMIT;
GO

