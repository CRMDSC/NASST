BEGIN TRANSACTION;
GO

CREATE TABLE [AdditionalInformation] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(max) NOT NULL,
    [IsArchived] bit NOT NULL,
    CONSTRAINT [PK_AdditionalInformation] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [DocumentTypes] (
    [Id] int NOT NULL IDENTITY,
    [Type] nvarchar(max) NOT NULL,
    [IsArchived] bit NOT NULL,
    CONSTRAINT [PK_DocumentTypes] PRIMARY KEY ([Id])
);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241022055945_DocsInformation', N'8.0.8');
GO

COMMIT;
GO

