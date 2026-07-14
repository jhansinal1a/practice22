# Database Integration (MongoDB Atlas)

React can't talk to MongoDB directly — the driver needs Node, and shipping DB credentials to the browser would expose them to anyone who opens dev tools. So this is a small Express backend that sits between your React app and Atlas.

Files (rename as noted when you drop them into a `server/` folder in your project):

| File here | Goes to |
|---|---|
| `server.js` | `server/server.js` |
| `db.js` | `server/db.js` |
| `ContactMessage.model.js` | `server/models/ContactMessage.js` |
| `contact.routes.js` | `server/routes/contact.js` |
| `package.json` | `server/package.json` |
| `.env.example` | `server/.env.example` |

## 1. Create the Atlas cluster

1. Sign up / log in at https://cloud.mongodb.com
2. Create a free (M0) cluster.
3. **Database Access** → add a database user with a username/password.
4. **Network Access** → add your IP (or `0.0.0.0/0` for testing — restrict this before going live).
5. **Connect** → "Drivers" → copy the connection string, looks like:
   ```
   mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/?retryWrites=true&w=majority
   ```

## 2. Configure the server

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env`:
```
MONGODB_URI=mongodb+srv://youruser:yourpassword@your-cluster.mongodb.net/company-site?retryWrites=true&w=majority
PORT=4000
```

Replace `<username>`, `<password>`, `<cluster-name>` with your real values, and pick a database name (e.g. `company-site`) — Atlas creates it automatically on first write. Never commit `.env`.

## 3. Run it

```bash
npm run dev    # nodemon, auto-restarts on changes
# or
npm start
```

You should see `MongoDB Atlas connected: company-site` and `Server running on http://localhost:4000`.

## 4. What's included

- `GET /api/health` — sanity check, returns `{ status: "ok" }`
- `POST /api/contact` — saves `{ name, email, message }` to the `ContactMessage` collection
- `GET /api/contact` — lists saved messages (lock this down with auth before shipping)

## 5. Call it from React

```js
await fetch("http://localhost:4000/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name, email, message }),
});
```

In production, point this at wherever you deploy the backend (Render, Railway, Fly.io, etc.) instead of localhost.

## Adding more data types

Copy the pattern in `ContactMessage.model.js` / `contact.routes.js` for anything else you need to store — new model file in `models/`, new route file in `routes/`, register it in `server.js` with `app.use("/api/whatever", whateverRoutes)`.
