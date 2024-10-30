BEGIN TRANSACTION;
GO

DECLARE @var0 sysname;
SELECT @var0 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SportTypes]') AND [c].[name] = N'PlayersCount');
IF @var0 IS NOT NULL EXEC(N'ALTER TABLE [SportTypes] DROP CONSTRAINT [' + @var0 + '];');
ALTER TABLE [SportTypes] DROP COLUMN [PlayersCount];
GO

EXEC sp_rename N'[SportTypes].[TeamsCount]', N'MaxTeams', N'COLUMN';
GO

ALTER TABLE [SportTypes] ADD [RegistrationTime] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
GO

ALTER TABLE [SportTypes] ADD [ReplacementTime] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
GO

ALTER TABLE [SportTypes] ADD [TeamAdminId] nvarchar(450) NULL;
GO

CREATE TABLE [SportAdditionalInformation] (
    [Id] int NOT NULL IDENTITY,
    [AdditionalInformationId] int NOT NULL,
    [InformationValue] nvarchar(max) NOT NULL,
    [SportTypeId] int NOT NULL,
    CONSTRAINT [PK_SportAdditionalInformation] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_SportAdditionalInformation_AdditionalInformation_AdditionalInformationId] FOREIGN KEY ([AdditionalInformationId]) REFERENCES [AdditionalInformation] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_SportAdditionalInformation_SportTypes_SportTypeId] FOREIGN KEY ([SportTypeId]) REFERENCES [SportTypes] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [SportDocumentTypes] (
    [Id] int NOT NULL IDENTITY,
    [DocumentTypeId] int NOT NULL,
    [DocumentLink] nvarchar(max) NOT NULL,
    [SportTypeId] int NOT NULL,
    CONSTRAINT [PK_SportDocumentTypes] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_SportDocumentTypes_DocumentTypes_DocumentTypeId] FOREIGN KEY ([DocumentTypeId]) REFERENCES [DocumentTypes] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_SportDocumentTypes_SportTypes_SportTypeId] FOREIGN KEY ([SportTypeId]) REFERENCES [SportTypes] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [SportPlayersCategories] (
    [Id] int NOT NULL IDENTITY,
    [CategoryId] int NOT NULL,
    [SportTypeId] int NOT NULL,
    [PlayersCount] int NOT NULL,
    CONSTRAINT [PK_SportPlayersCategories] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_SportPlayersCategories_Category_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [Category] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_SportPlayersCategories_SportTypes_SportTypeId] FOREIGN KEY ([SportTypeId]) REFERENCES [SportTypes] ([Id]) ON DELETE CASCADE
);
GO

CREATE INDEX [IX_SportTypes_TeamAdminId] ON [SportTypes] ([TeamAdminId]);
GO

CREATE INDEX [IX_SportAdditionalInformation_AdditionalInformationId] ON [SportAdditionalInformation] ([AdditionalInformationId]);
GO

CREATE INDEX [IX_SportAdditionalInformation_SportTypeId] ON [SportAdditionalInformation] ([SportTypeId]);
GO

CREATE INDEX [IX_SportDocumentTypes_DocumentTypeId] ON [SportDocumentTypes] ([DocumentTypeId]);
GO

CREATE INDEX [IX_SportDocumentTypes_SportTypeId] ON [SportDocumentTypes] ([SportTypeId]);
GO

CREATE INDEX [IX_SportPlayersCategories_CategoryId] ON [SportPlayersCategories] ([CategoryId]);
GO

CREATE INDEX [IX_SportPlayersCategories_SportTypeId] ON [SportPlayersCategories] ([SportTypeId]);
GO

ALTER TABLE [SportTypes] ADD CONSTRAINT [FK_SportTypes_AspNetUsers_TeamAdminId] FOREIGN KEY ([TeamAdminId]) REFERENCES [AspNetUsers] ([Id]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241022090227_SportsTypesAddition', N'8.0.8');
GO

COMMIT;
GO

