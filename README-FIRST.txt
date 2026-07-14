WAYPOINT DATABASE BACKEND - FIRST STEPS

IMPORTANT SECURITY
1. The MongoDB password and Gmail App Password were visible in screenshots.
2. Change both passwords before using this backend.
3. Never upload or share your .env file.

COPY THESE FILES
Copy server.js, db.js, package.json, models, routes, uploads, .gitignore and .env.example
into the main waypoint-employer-portal folder.
Do NOT delete your existing public folder.

CREATE .env
Make a new file named exactly .env in the main project folder.
Copy .env.example into it and replace the placeholders with your NEW credentials.

INSTALL AND RUN
Open Command Prompt in the main project folder and run:

npm install
npm start

EXPECTED OUTPUT
MongoDB Atlas connected: waypoint_portal
Waypoint Portal running at http://localhost:3001
Health check: http://localhost:3001/api/health

TEST IN CHROME
http://localhost:3001/api/health

MAIN API ROUTES
/api/employees
/api/employers
/api/jobs
/api/applications
/api/events
/api/invitations
/api/invite
/api/contact
/api/uploads/resume
