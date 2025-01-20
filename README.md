
# Chatly

**Chatly** is a modern, real-time messaging platform designed to provide a secure and seamless communication experience for users. Built with **Next.js**, **Prisma**, **Tailwind CSS**, and **NextAuth.js**, Chatly offers secure authentication, real-time messaging, and integrations with popular services like Google and Discord.

---

## Features
- **Real-time messaging**: Instant, live communication.
- **Secure authentication**: Utilizes NextAuth.js for user authentication.
- **OAuth Sign-In**: Login via **Google** and **Discord** providers.
- **Modern tech stack**: Built with **Prisma**, **Next.js**, and **Tailwind CSS** for a fast, responsive, and scalable platform.

---

## Setup Instructions

### Prerequisites
Before getting started, ensure you have the following installed on your local development environment:
- **Node.js** (v16 or higher is recommended)
- **npm** or **yarn**
- A **PostgreSQL** database instance (local or remote)

---

### Clone the Repository
To get started, clone the repository to your local machine:
```bash
git clone <repository_url>
cd <repository_name>
```

---

### Environment Setup

1. **Create the `.env` file**:  
   Copy the `.env.example` file and rename it to `.env`:
   ```bash
   cp .env.example .env
   ```

2. **Populate the `.env` file** with the required values:
   - Replace placeholders with your specific configuration (e.g., database URL, authentication secrets).

3. **Generate the `AUTH_SECRET`**:  
   Use the following command to generate the `AUTH_SECRET` for secure authentication:
   ```bash
   npx auth secret
   ```

---

### OAuth Setup

#### Discord Provider
1. Navigate to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Click **"New Application"** and provide a name for your app.
3. Under the **"OAuth2"** tab, add the following redirect URI for local development:
   - `http://localhost:3000/api/auth/callback/discord`
4. Copy the **Client ID** and **Client Secret** from Discord and add them to your `.env` file:
   ```
   AUTH_DISCORD_ID=<your_client_id>
   AUTH_DISCORD_SECRET=<your_client_secret>
   ```

#### Google Provider
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Navigate to **"APIs & Services" > "Credentials"**, and click **"Create Credentials" > "OAuth 2.0 Client IDs"**.
4. Set the application type to **"Web application"** and add the following redirect URI for local development:
   - `http://localhost:3000/api/auth/callback/google`
5. Copy the **Client ID** and **Client Secret** from Google and add them to your `.env` file:
   ```
   AUTH_GOOGLE_ID=<your_client_id>
   AUTH_GOOGLE_SECRET=<your_client_secret>
   ```

---

### Database Setup

1. **Using Docker**:  
   If you're using Docker, you can quickly start a PostgreSQL container by running the provided `start-database.sh` script. This will automatically spin up a local PostgreSQL database.

   Alternatively, you can manually set up a PostgreSQL database on your local machine or use a hosted instance.

2. **Configure the Database Connection**:  
   Once your database is set up, update the `DATABASE_URL` in your `.env` file with the correct connection string. Ensure that the string includes the appropriate username, password, host, port, and database name.

3. **Run Database Migrations**:  
   Apply the database migrations to set up the schema using Prisma:
   ```bash
   npx prisma migrate dev
   ```

---

### Running the Application

1. Install the required dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000` to access the application.

---

## Updating Environment Variables Schema

When adding new environment variables, follow these steps to keep everything organized:

1. Update the `.env.example` file to include the new variable.
2. Modify the schema validation in `src/env.js` to ensure all new variables are correctly validated.

---

## Contributing

We welcome contributions to improve Chatly! Here's how you can help:

1. **Report bugs**: If you encounter any issues, please [create an issue](https://github.com/Aadithya-j/chatly/issues).
2. **Fix bugs**: If you've found a bug, feel free to open a pull request with the fix.
3. **Suggest features**: We welcome suggestions for new features and improvements. Create an issue with your proposal.
4. **Submit pull requests**: If you'd like to contribute code, make sure to follow our coding guidelines and test your changes before submitting a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.