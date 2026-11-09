# Bugs found — auth flow (UI + server)

Status as of 2026-11-07. ✅ = fixed, ⚠️ = open.

## Server (`server/`)

| # | Status | File | Bug | Fix |
|---|---|---|---|---|
| 1 | ✅ ⚠️ | `routes/auth.ts` | `signToken` is `async` but wasn't awaited, so the cookie held a Promise, serialized as `token=j:{}`. `/me` could never verify it. | `const token = await signToken(user)`. **Your login code is currently commented out, so this fix isn't running.** |
| 2 | ✅ ⚠️ | `routes/auth.ts` | Login required `name` and found the user by email only. The password was never checked, so anyone who knew an email could log in. | Take `email` + `password`, check with `compare()`, return 401 `invalid credentials`. **Commented out, like #1.** |
| 3 | ✅ | `app.ts` | `cors({ origin: '*', credentials: true })`: browsers reject a wildcard origin when credentials are on. | `origin: 'http://localhost:3000'` |
| 4 | ✅ | `app.ts` | `cookie-parser` was installed but not mounted, so `req.cookies` was `undefined` in `/me`. | `app.use(cookieParser())` |
| 5 | ✅ | `routes/auth.ts` | Registering a duplicate email: `throw new Error(err)` returned an Express 500 **HTML** page the UI can't parse. | `err.code === 11000` → 409 JSON; anything else → 500 JSON. |
| 6 | ✅ | `model/user.ts` | `require: true` isn't a Mongoose option (it's `required`), so no field was actually required. | `required: true` |
| 7 | ✅ | `db/db.ts` | `mongoConntct()` throws but nothing awaits it. If Mongo is down, the server stays up and every query hangs ~10s, then fails. | `console.error` + `process.exit(1)` |
| 8 | ✅ | `routes/auth.ts` | Cookie `maxAge` was 15 min but the JWT lasts 1 day, so users got logged out early. | `maxAge: 24 * 60 * 60 * 1000` |
| 9 | ⚠️ | `routes/auth.ts` | Register checks `name`/`email` but not `password`. `hash(undefined)` throws, so the user gets a 500 instead of a 400. The validation error also comes back as plain text with status 200 (`res.send(...)`). | `if (!name \|\| !email \|\| !password) return res.status(400).json({ msg: ... })` |
| 10 | ⚠️ | `routes/auth.ts` | `/me` returns `{ userId: jwtPayload }`, and the payload already contains `userId`, so the response is `{ userId: { userId, iat, exp } }`. | `return res.json({ userId: jwtPayload.userId })` |
| 11 | ⚠️ | `utils/utils.ts` | If `JWT_SECRET` is missing, `signToken` returns `-1` instead of failing, so the cookie silently becomes `token=-1`. | Throw at startup when `JWT_SECRET` is missing. |
| 12 | ⚠️ (minor) | `app.ts`, `config.ts` | `process.loadEnvFile()` runs twice, on top of `--env-file-if-exists` in the `dev` script. It throws if `.env` is missing, which defeats `-if-exists`. | Keep only one (the CLI flag). |

## UI (`UI/`)

| # | Status | File | Bug | Fix |
|---|---|---|---|---|
| 13 | ✅ | `app/(auth)/layout.tsx` | Prop was `{Children}` (capital C). Next passes `children`, so login/register pages didn't render. | `{ children }: { children: React.ReactNode }` |
| 14 | ✅ | `lib/api.ts` | Header typos `'Conntent-Type': "appliction/json"`, so fetch sent `text/plain` and `express.json()` skipped the body: **`req.body` was `undefined`**. | `'Content-Type': "application/json"` |
| 15 | ✅ | `lib/api.ts` | No `credentials: "include"`, so the browser threw away the `token` cookie from the server on another port. | Added `credentials: "include"` |
| 16 | ✅ | `app/(auth)/login/page.tsx` | Rendered the empty `components/LoginForm.tsx` instead of the real form. | Now uses `components/forms/LoginForm.tsx` (you fixed this). |
| 17 | ⚠️ | `components/forms/LoginForm.tsx` | `useRouter` imported from `"next/router"`. That's the Pages Router; in `app/` it throws once used. | `import { useRouter } from "next/navigation"` |
| 18 | ⚠️ | `components/forms/LoginForm.tsx` | `import { error } from "console"` pulls a Node module into a client component, and the `error` state shadows it. | Delete the import. |
| 19 | ⚠️ | `lib/api.ts` | `errorText()` reads `body.error`, but the server sends `{ msg }`, so every error shows as `"Request faild"`. | Read `body.msg` (or make the server send `error`). |
| 20 | ⚠️ (minor) | `lib/auth.ts` | `login()` is typed as returning `{ user: User }`, but the server returns `{ ok: true }`. | Align the type with the real response. |
| 21 | ⚠️ (old form) | `components/forms/LoginForm.tsx` (pre-rewrite) | `if (errors) setErrors(error)` checked the old state instead of the new result, so errors never showed on the first submit. | Removed by your react-hook-form rewrite, so nothing to do. |

## Not bugs, but still needed for the auth flow

- `app/page.tsx` redirects `/` → `/login` for everyone, logged in or not.
- A `proxy.ts` that checks the `token` cookie: no token → `/login`, token on `/login` or `/register` → `/welcome`. Remove the `/` redirect once it exists.
- After a successful login: `router.push('/welcome')` + `router.refresh()`.
