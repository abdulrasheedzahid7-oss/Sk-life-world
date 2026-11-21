# SK Life World
Urdu 2D life-simulation game.

## Run locally
Serve this folder over HTTP:
`python -m http.server 8000`
Open `http://localhost:8000`.

## Firebase
1. Enable Email/Password and Google Authentication.
2. Add your deployed domain in Authentication → Settings → Authorized domains.
3. Publish `database.rules.json` in Realtime Database → Rules.
4. The client configuration is in `firebase.js`. Never put Admin SDK credentials in frontend code.

The game includes age progression, education, skills, careers, businesses, virtual banking, shopping, assets, a 2D city scene, local saves and Firebase cloud saves. Friends and private chat are a local prototype, not a secure multiplayer feature. Virtual currency has no real-world value.