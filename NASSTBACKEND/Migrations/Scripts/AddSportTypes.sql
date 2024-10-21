BEGIN TRANSACTION;
GO

CREATE TABLE [SportTypes] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(max) NOT NULL,
    [PlayersCount] int NOT NULL,
    [TeamsCount] int NOT NULL,
    [IsArchived] bit NOT NULL,
    [CreatedById] nvarchar(450) NULL,
    [UpdatedById] nvarchar(450) NULL,
    CONSTRAINT [PK_SportTypes] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_SportTypes_AspNetUsers_CreatedById] FOREIGN KEY ([CreatedById]) REFERENCES [AspNetUsers] ([Id]),
    CONSTRAINT [FK_SportTypes_AspNetUsers_UpdatedById] FOREIGN KEY ([UpdatedById]) REFERENCES [AspNetUsers] ([Id])
);
GO

CREATE INDEX [IX_SportTypes_CreatedById] ON [SportTypes] ([CreatedById]);
GO

CREATE INDEX [IX_SportTypes_UpdatedById] ON [SportTypes] ([UpdatedById]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241011035247_AddSportTypes', N'8.0.8');
GO

COMMIT;
GO

