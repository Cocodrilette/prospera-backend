# Use an official Node.js runtime as the base image
FROM node:lts

# Set the working directory in the container to /app
WORKDIR /prospera-backend

# Copy package.json and package-lock.json to the working directory
COPY package.json pnpm-lock.yaml ./

# Install the application dependencies
RUN npm install -g pnpm
RUN pnpm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose port 3000 for the application
EXPOSE 3000

# Define the command to run the application
CMD ["pnpm", "start:prod"]