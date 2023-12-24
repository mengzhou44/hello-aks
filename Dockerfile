# Use the official Node.js image with version 18
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Install TypeScript globally
RUN npm install -g typescript

# Copy the rest of the application code to the working directory
COPY . .

# Build TypeScript code
RUN npm run build

# Expose the port that your app will run on
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=local
ENV PORT=3000

# Command to run your application
CMD ["npm", "start"]
