# HMS Server API

JSend envelopes throughout: `{"status":"success","data":...}`, `{"status":"fail","data":...}`, `{"status":"error","message":...}`.

## Endpoints

| Method | Path                     | Auth   | Notes                                              |
|--------|--------------------------|--------|-----------------------------------------------------|
| POST   | `/api/auth/login`        | open   | `{username, password}` → `{id, username, accessToken, refreshToken}` |
| POST   | `/api/auth/refresh`      | open   | `{refreshToken}` → `{accessToken}`                  |
| GET    | `/api/auth/healthcheck`  | open   | Liveness check                                      |
| GET    | `/api/opregister?opid=`  | Bearer | Looks up an OP register entry by `opid`             |
| POST   | `/api/tomogram`          | Bearer | Multipart upload (auth enforced before file parsing)|
| GET    | `/api/tomogram?opid=`    | Bearer | Lists uploaded tomogram sets for an OP number        |

Access tokens (`token_type: "access"`) expire in 2 hours; refresh tokens (`token_type: "refresh"`)
expire in 5 days and are signed with a different secret. Protected routes read
`Authorization: Bearer <accessToken>` (also accept `token` in the body/query for
backwards compatibility). Any missing/invalid/expired/wrong-type token yields
`401 {"status":"fail","data":"..."}`.

## Manual verification (curl)

Replace `<username>` / `<password>` with real local credentials — never commit
real credentials here or anywhere else in source/tests.

```bash
# 1. Protected route without a token -> 401
curl -s -w '\nHTTP %{http_code}\n' "http://localhost:4041/api/opregister?opid=580"
# {"status":"fail","data":"Authentication required"}

# 2. Log in
TOKENS=$(curl -s -H 'Content-Type: application/json' \
  -d '{"username":"<username>","password":"<password>"}' \
  http://localhost:4041/api/auth/login)
ACCESS=$(echo "$TOKENS" | sed -E 's/.*"accessToken":"([^"]+)".*/\1/')
REFRESH=$(echo "$TOKENS" | sed -E 's/.*"refreshToken":"([^"]+)".*/\1/')

# 3. Protected route with a valid access token -> 200
curl -s -w '\nHTTP %{http_code}\n' -H "Authorization: Bearer $ACCESS" \
  "http://localhost:4041/api/opregister?opid=580"

# 4. Refresh a valid refresh token -> 200 with a new accessToken
curl -s -w '\nHTTP %{http_code}\n' -H 'Content-Type: application/json' \
  -d "{\"refreshToken\":\"$REFRESH\"}" http://localhost:4041/api/auth/refresh

# 5. Refresh an invalid refresh token -> 401
curl -s -w '\nHTTP %{http_code}\n' -H 'Content-Type: application/json' \
  -d '{"refreshToken":"bad"}' http://localhost:4041/api/auth/refresh

# 6. Tomogram upload with a valid token but no files -> 400
#    (proves auth runs before multer: request is rejected for a validation
#    reason, not for missing auth)
curl -s -w '\nHTTP %{http_code}\n' -H "Authorization: Bearer $ACCESS" \
  -F opid=580 http://localhost:4041/api/tomogram

# 7. Tomogram upload without a token -> 401
curl -s -w '\nHTTP %{http_code}\n' -F opid=580 http://localhost:4041/api/tomogram

# 8. Tomogram history for an OP number -> 200 with an array of sets
curl -s -w '\nHTTP %{http_code}\n' -H "Authorization: Bearer $ACCESS" \
  "http://localhost:4041/api/tomogram?opid=580"

# 9. Tomogram history for a non-existent OP number -> 404
curl -s -w '\nHTTP %{http_code}\n' -H "Authorization: Bearer $ACCESS" \
  "http://localhost:4041/api/tomogram?opid=999999"
```

## GET /api/tomogram?opid= response shape

`data` is an array, ordered newest first (by `date` desc, then `id` desc), of:

```json
{
  "id": 9,
  "dateTime": "2026-09-09T14:17:17.910Z",
  "doctorId": 1,
  "tomogramTypeId": 6,
  "details": [
    { "id": 9, "tomogramPartId": 2, "narration": "curl test task2" }
  ]
}
```

- `id` is the `TomogramMaster` row id; `dateTime` is `TomogramMaster.DateTime`
  serialised as an ISO 8601 string.
- `details` lists that master's `TomogramDetail` rows (ordered by `id` asc);
  `narration` is `""` when the stored value is null.
- `opid` not found → `404 {"status":"fail","data":"Invalid OP Number"}`.
- Missing/non-numeric `opid` → `400 {"status":"fail","data":"Invalid opid"}`.

## Settings-driven tomogram identifiers

`POST /api/tomogram` no longer hard-codes the doctor/type/part IDs used when
creating a `TomogramMaster`/`TomogramDetail` row. It reads them from the
`Settings` table (via `src/helpers/settings.ts`, `getSetting`/`getSettingInt`),
falling back to the previous literals if a row is missing or empty:

| Settings key         | Fallback | Used for                        |
|-----------------------|----------|----------------------------------|
| `PrimaryDoctorID`     | `1`      | `TomogramMaster.DoctorID`        |
| `TomogramTypeID`      | `6`      | `TomogramMaster.TomogramTypeID`  |
| `TomogramPartID`      | `2`      | `TomogramDetail.TomogramPartID`  |

`Settings` rows are `{Key, Value}` pairs (the `TomogramPath` upload directory
already came from this table via `multer.ts`; the model's attribute for the
lookup column was renamed from `opid` to `key` to match).

For a fresh local DB that is missing the `TomogramType`/`TomogramPart` lookup
rows referenced by the fallbacks (`TomogramType.ID = 6`, `TomogramPart.ID = 2`)
and/or the corresponding `Settings` rows, run `sql/seed-local-tomogram.sql`
once against `HospitalMain` (not run automatically, and not part of this
task's changes — it only inserts rows that don't already exist).
