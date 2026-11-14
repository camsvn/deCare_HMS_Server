# Deploying HMSServer

Releases are manual. On the dev machine you build `bundle-<version>.zip`, copy it to the client's
Windows server, unzip it into its own versioned folder, and point the NSSM service at that folder.
Node comes from nvm-windows.

```
dev machine                          client server
-----------                          -------------
npm run bundle:release  ──zip──▶     C:\DeCareHMS\2026.11.1\   ◀── NSSM service "DeCareHMS"
                                     C:\DeCareHMS\2026.12.1\       (AppDirectory = one of these)
                                     C:\DeCareHMS\service-logs\
```

The paths and the service name `DeCareHMS` are examples. If your service already exists under a
different name, use that name; `nssm edit <name>` shows its current settings.

## Versions

- Calendar versions like the mobile app, `YYYY.M.N` (the month, then a release count within it),
  numbered independently of the app. The version lives in `package.json`.
- The running server reports it: `GET /api/auth/healthcheck` returns `"version"`, and the service
  log prints `Server :: v<version> Running @ …` on start.
- Each bundle carries `release/BUILD.txt` with the version, commit, build date and Node version.
- **Branch:** `main` needs Node 24 (`.nvmrc`, `engines`). A server that must stay on Node 16 is
  built from the `node16` branch, which has the same features with older packages, but not this
  versioned bundle script (it produces a plain `bundle.zip`).

## 1. Build a release (dev machine)

```bash
git switch main && git pull
npm version 2026.12.1 --no-git-tag-version   # bumps package.json and package-lock.json
git commit -am "release: server 2026.12.1"
npm run bundle:release                       # webpack, then zips → bundle-2026.12.1.zip
git tag -a 2026.12.1 -m "What changed, in a line or two"
git push origin main 2026.12.1
```

`bundle:release` warns if there are uncommitted changes, because the bundle would not match the
commit in `BUILD.txt`.

The zip contains `release/hms_uploader_service.js` (all of `src/` in one file),
`release/BUILD.txt`, `package.json`, `package-lock.json`, `.nvmrc`, `.env.template`, `views/` and
`public/`. It contains no `node_modules` (installed on the server) and no `.env` (secrets stay on
the server).

## 2. First install on a new server

Prerequisites: [nvm-windows](https://github.com/coreybutler/nvm-windows),
[NSSM](https://nssm.cc), and network access to the SQL Server. Run the steps in an
**Administrator** command prompt.

1. **Node.** Install the version in the bundle's `.nvmrc` and note where nvm keeps it:

   ```bat
   nvm install 24.12.0
   nvm use 24.12.0
   nvm root
   ```

   The service will run `<nvm root>\v24.12.0\node.exe`. Use that exact path, not the nvm
   `nodejs` symlink: `nvm use` repoints the symlink machine-wide, and the service would silently
   change Node version on its next restart.

2. **Files.** Unzip the bundle into `C:\DeCareHMS\2026.11.1`, then in that folder:

   ```bat
   npm ci --omit=dev
   copy .env.template .env
   notepad .env
   ```

   Fill in the SQL settings, `PORT`, and `APP_SECRET`. For the secret, use a long random value,
   for example from `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
   Without one the server falls back to a built-in default secret, which is not safe.

3. **Try it in the foreground** from the install folder. It must start there: `.env`, `views\`,
   `public\` and `.logs\` are all found relative to the working directory.

   ```bat
   node release\hms_uploader_service.js
   ```

   Expect `Server :: v2026.11.1 Running @ 'http://localhost:4040'`. Stop it with Ctrl+C.

4. **Install the service:**

   ```bat
   nssm install DeCareHMS "C:\nvm\v24.12.0\node.exe" release\hms_uploader_service.js
   nssm set DeCareHMS AppDirectory C:\DeCareHMS\2026.11.1
   nssm set DeCareHMS AppEnvironmentExtra NODE_ENV=production
   nssm set DeCareHMS AppStdout C:\DeCareHMS\service-logs\out.log
   nssm set DeCareHMS AppStderr C:\DeCareHMS\service-logs\err.log
   nssm set DeCareHMS AppRotateFiles 1
   nssm set DeCareHMS AppRotateBytes 10485760
   nssm set DeCareHMS Start SERVICE_AUTO_START
   nssm start DeCareHMS
   ```

   (Replace `C:\nvm` with the folder `nvm root` printed.)

   - **Service account:** the service runs as LocalSystem by default. If the photo folder (the
     `TomogramPath` row in the main database's `Settings` table) is a network share, LocalSystem
     cannot write to it. Run the service as an account that can:
     `nssm set DeCareHMS ObjectName DOMAIN\user password`.
   - **Firewall:** let the phones reach the port:
     `netsh advfirewall firewall add rule name="DeCare HMS" dir=in action=allow protocol=TCP localport=4040`

5. **Check:** `curl http://localhost:4040/api/auth/healthcheck` should show the version. From a
   phone on the same network, the app's server URL is `http://<server-ip>:4040`.

## 3. Updating to a new version

Each version gets its own folder, so an update is a switch of `AppDirectory`, and a rollback is
switching it back.

1. Unzip the new bundle into `C:\DeCareHMS\2026.12.1`.
2. If its `.nvmrc` names a Node version you don't have, `nvm install` it. Then, in the new
   folder:

   ```bat
   nvm use 24.12.0
   npm ci --omit=dev
   copy ..\2026.11.1\.env .env
   ```

   Keep the same `.env`: a different `APP_SECRET` signs every user out. Compare it with the new
   `.env.template` for settings added since.

3. Try it on a spare port while the old version keeps serving:

   ```bat
   set PORT=4999
   node release\hms_uploader_service.js
   ```

   Open `http://localhost:4999/api/auth/healthcheck`, check the version, then Ctrl+C and close
   that prompt (so `PORT=4999` does not linger).

4. Switch and restart:

   ```bat
   nssm set DeCareHMS AppDirectory C:\DeCareHMS\2026.12.1
   nssm restart DeCareHMS
   ```

   If the Node version changed, also run `nssm set DeCareHMS Application <nvm root>\v<new>\node.exe`
   before the restart.

5. Check the health check shows the new version, and `service-logs\err.log` is quiet.

**Rollback:** set `AppDirectory` (and `Application`, if you changed it) back to the previous
folder and `nssm restart DeCareHMS`. Keep the last two or three version folders; delete older ones.

## What lives where

| What | Where | Survives an update? |
| --- | --- | --- |
| Uploaded photos | folder in `Settings.TomogramPath` (main database) | Yes, outside the install |
| App logs | `.logs\` in the install folder, kept `LOG_DAYS` days | Stays with the old version's folder |
| Service output | `C:\DeCareHMS\service-logs\` (NSSM) | Yes |
| Configuration | `.env` in the install folder | Copied forward by hand (step 3.2) |

## Troubleshooting

- **Service starts, then stops:** read `service-logs\err.log`. Usually a wrong `.env` value or an
  unreachable SQL Server. Run step 2.3 in the foreground to see the error directly.
- **Uploads fail with "Upload path not found":** the `TomogramPath` row is missing from `Settings`.
- **Phones can't connect, but `localhost` works:** the firewall rule, or the app's server URL
  (machine IP and `PORT`).
- **Everyone was signed out after an update:** `APP_SECRET` changed. Restore the previous value.
- **The old React Native app stopped working:** expected. The server now requires a login token
  on `/api/opregister` and `/api/tomogram`, which only the Flutter app sends. Roll the server out
  together with the Flutter app.
