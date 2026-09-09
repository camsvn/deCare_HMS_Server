USE HospitalMain;
IF NOT EXISTS (SELECT 1 FROM dbo.TomogramType WHERE ID = 6)
BEGIN
  SET IDENTITY_INSERT dbo.TomogramType ON;
  INSERT INTO dbo.TomogramType (ID, Name) VALUES (6, 'Dermatology');
  SET IDENTITY_INSERT dbo.TomogramType OFF;
END
IF NOT EXISTS (SELECT 1 FROM dbo.TomogramPart WHERE ID = 2)
BEGIN
  SET IDENTITY_INSERT dbo.TomogramPart ON;
  INSERT INTO dbo.TomogramPart (ID, Name) VALUES (2, 'Skin');
  SET IDENTITY_INSERT dbo.TomogramPart OFF;
END
IF NOT EXISTS (SELECT 1 FROM dbo.Settings WHERE [Key] = 'TomogramTypeID')
  INSERT INTO dbo.Settings ([Key], [Value]) VALUES ('TomogramTypeID', '6');
IF NOT EXISTS (SELECT 1 FROM dbo.Settings WHERE [Key] = 'TomogramPartID')
  INSERT INTO dbo.Settings ([Key], [Value]) VALUES ('TomogramPartID', '2');
