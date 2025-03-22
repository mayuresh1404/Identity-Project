# Use Node.js as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Ensure the routes folder is copied before everything else
COPY routes/ /app/routes/

# Copy all other project files into the container
COPY . .

# Set environment variable
ENV NODE_ENV=production

# Expose port 5000
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
