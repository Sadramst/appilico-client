# Backend CORS Update Required

The backend needs CORS updated to allow these origins:

- `http://localhost:3000` (local dev)
- `https://appilico-client.vercel.app` (production)
- `https://*.vercel.app` (preview deployments)

Add to backend `Program.cs` CORS policy.
