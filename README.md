
# Chatly

**Chatly** is a modern, real-time messaging platform that provides a secure and seamless communication experience for its users.

---

## Features
- **Real-time messaging**
- **Secure authentication** using NextAuth.js
- **Google and Discord providers** for easy sign-in
- Built with **Prisma**, **Next.js**, and **Tailwind CSS** for a robust and elegant frontend and backend.

---

## Setup Instructions

### Prerequisites
Ensure you have the following installed on your system:
- **Node.js** (v16 or higher recommended)
- **npm** or **yarn**
- A **PostgreSQL** database instance

---

### Clone the Repository
```bash
git clone <repository_url>
cd <repository_name>
```

---

### Environment Setup

1. **Create a `.env` file**:  
   Copy the `.env.example` file and rename it to `.env`:
   ```bash
   cp .env.example .env
   ```

2. **Populate the `.env` file** with your secrets and configuration:
   - Replace placeholders with your values.

3. Generate the `AUTH_SECRET` with the following command:
   ```bash
   npx auth secret
   ```

---

### OAuth Setup

#### Discord Provider
1. Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Click **"New Application"** and give it a name.
3. Navigate to the **"OAuth2"** tab and add a redirect URI:
   - For local development: `http://localhost:3000/api/auth/callback/discord`
4. Copy the **Client ID** and **Client Secret** into your `.env` file as:
   ```
   AUTH_DISCORD_ID=<your_client_id>
   AUTH_DISCORD_SECRET=<your_client_secret>
   ```

#### Google Provider
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Navigate to **"APIs & Services" > "Credentials"** and click **"Create Credentials" > "OAuth 2.0 Client IDs"**.
4. Set the application type to **"Web application"** and add the redirect URI:
   - For local development: `http://localhost:3000/api/auth/callback/google`
5. Copy the **Client ID** and **Client Secret** into your `.env` file as:
   ```
   AUTH_GOOGLE_ID=<your_client_id>
   AUTH_GOOGLE_SECRET=<your_client_secret>
   ```

---

### Database Setup
1. Ensure your **PostgreSQL** database is running and accessible.
2. Update the `DATABASE_URL` in the `.env` file with your database connection string.
3. Apply database migrations:
   ```bash
   npx prisma migrate dev
   ```

---

### Running the Application
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Access the application in your browser at:  
   **[http://localhost:3000](http://localhost:3000)**

---

## Deployment
For deployment, ensure the following:
1. Set `NODE_ENV` to `production` in your `.env` file.
2. Use a production-ready database and update the `DATABASE_URL`.
3. Follow the hosting provider’s guidelines for deploying a Next.js application.

---

## Updating Environment Variables Schema
When adding new environment variables:
1. Update the `.env.example` file with the new variable.
2. Modify the schema in `src/env.js` to validate the new variable.

---

## Contributing
Contributions are welcome!