# --- Stage 1: Build the React/Vite Application ---
FROM node:20-alpine AS build

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
# This is a key Docker layer caching technique:
# it only invalidates if package.json changes.
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Expose port 80 (default HTTP port)
EXPOSE 3000

# The default CMD will start the web server
CMD ["npm", "run", "dev"]
