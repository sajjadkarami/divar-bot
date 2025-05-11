# Use the official Node.js image as the base image
FROM node:22.14.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./
COPY prisma ./prisma
COPY .env .env


# Install dependencies
RUN npm install --verbose
RUN npx prisma db push
RUN npx prisma generate
# Copy the rest of your application code
COPY . .

RUN npm run build

# Command to run your app
CMD ["npm", "run", "start"]