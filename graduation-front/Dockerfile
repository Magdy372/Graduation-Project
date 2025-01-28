# Use the official Node.js image
FROM node:18-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the project for production
RUN npm run build

# Expose the port that Vite runs on
EXPOSE 5173

# Command to run the Vite preview server
CMD ["npm", "run", "preview"]
