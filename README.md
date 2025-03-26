## Project Setup Guide

This guide will help you set up the project locally.

### Prerequisites

Ensure you have the following installed on your machine:
- Node.js (v16 or higher)
- Yarn (v1.22.22 or higher)
- Docker

### Installation Steps

1. **Clone the repository:**
   ```sh
   git clone <repository-url>
   ```

2. **Install dependencies:**
   ```sh
   yarn install
   ```

3. **Set up environment variables:**
    - Copy the `.env.example` file to `.env`:

    - Update the `.env` file with your specific values if necessary.

4. **Start the PostgreSQL database using Docker:**
   ```sh
   docker-compose up -d
   ```

5. **Run the development server:**
   ```sh
   yarn dev
   ```

### Additional Commands

- **Build the project:**
  ```sh
  yarn build
  ```

- **Start the production server:**
  ```sh
  yarn start
  ```

- **Lint the project:**
  ```sh
  yarn lint
  ```

### Notes

- Ensure Docker is running before starting the development server.
- The database connection string and other secrets are managed in the `.env` file.
- The project uses Tailwind CSS for styling and Payload CMS for content management.