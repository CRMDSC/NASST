BEGIN TRANSACTION;
GO

ALTER TABLE [AspNetUsers] ADD [CategoryId] int NULL;
GO

CREATE INDEX [IX_AspNetUsers_CategoryId] ON [AspNetUsers] ([CategoryId]);
GO

ALTER TABLE [AspNetUsers] ADD CONSTRAINT [FK_AspNetUsers_Category_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [Category] ([Id]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241021052931_PlayersCategoryID', N'8.0.8');
GO

COMMIT;
GO

