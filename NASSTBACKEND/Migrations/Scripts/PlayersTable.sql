BEGIN TRANSACTION;
GO

DROP TABLE [PlayersCategories];
GO

CREATE TABLE [Players] (
    [Id] int NOT NULL IDENTITY,
    [FirstName] nvarchar(max) NULL,
    [LastName] nvarchar(max) NULL,
    [CategortId] int NOT NULL,
    [CategoryId] int NOT NULL,
    [CreatedOn] datetime2 NOT NULL,
    [UpdatedOn] datetime2 NULL,
    [IsArchived] bit NOT NULL,
    [CreatedById] nvarchar(450) NULL,
    [UpdatedById] nvarchar(450) NULL,
    CONSTRAINT [PK_Players] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Players_AspNetUsers_CreatedById] FOREIGN KEY ([CreatedById]) REFERENCES [AspNetUsers] ([Id]),
    CONSTRAINT [FK_Players_AspNetUsers_UpdatedById] FOREIGN KEY ([UpdatedById]) REFERENCES [AspNetUsers] ([Id]),
    CONSTRAINT [FK_Players_Category_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [Category] ([Id]) ON DELETE CASCADE
);
GO

CREATE INDEX [IX_Players_CategoryId] ON [Players] ([CategoryId]);
GO

CREATE INDEX [IX_Players_CreatedById] ON [Players] ([CreatedById]);
GO

CREATE INDEX [IX_Players_UpdatedById] ON [Players] ([UpdatedById]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241021092653_PlayersTable', N'8.0.8');
GO

COMMIT;
GO

