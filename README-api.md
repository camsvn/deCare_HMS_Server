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
| GET    | `/api/tomogram?opid=`    | Bearer | (unchanged by this task; listed per target API)     |

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
```
