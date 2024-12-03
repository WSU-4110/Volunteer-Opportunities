# Installation

1. clone repository

git clone https://github.com/WSU-4110/Volunteer-Opportunities

2. Download Node.js [Link](https://nodejs.org/en) version 20 or newer

3. In Volunteer-Oppertunities directory run npm install to install dependencies.

4. Rename .env.example to .env and fill in service secrets with values.

```
DATABASE_URL=
NODE_ENV=
GOOGLE_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
AUTH_SECRET=
REGION=
BUCKET=
ACCESS_KEY_ID=
SECRET_ACCESS_KEY_ID=
NEXT_PUBLIC_GL_MAPBOX_ACCESS_TOKEN=
PUSHER_APP_ID=
NEXT_PUBLIC_PUSHER_KEY=
PUSHER_SECRET=
NEXT_PUBLIC_PUSHER_CLUSTER=
```

5. Run the command "npm run dev" in the root directory of your cloned repository.
