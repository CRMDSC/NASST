BEGIN TRANSACTION;
GO

ALTER TABLE [AspNetUsers] ADD [FCMToken] nvarchar(max) NULL;
GO

CREATE TABLE [UserRefreshTokens] (
    [Id] int NOT NULL IDENTITY,
    [Token] nvarchar(70) NOT NULL,
    [Expires] datetime2 NULL,
    [Created] datetime2 NOT NULL,
    [CreatedByIp] nvarchar(30) NULL,
    [Revoked] datetime2 NULL,
    [RevokedByIp] nvarchar(30) NULL,
    [ReplacedByToken] nvarchar(70) NULL,
    [UserId] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_UserRefreshTokens] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_UserRefreshTokens_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);
GO

CREATE INDEX [IX_UserRefreshTokens_UserId] ON [UserRefreshTokens] ([UserId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241007072701_AddedUserToken', N'8.0.8');
GO

COMMIT;
GO

