# Use the latest LTS version of Node.js
FROM node:18-alpine AS build

# Set the working directory inside the container
WORKDIR /

ARG BACKEND_BASE_URL

ENV BACKEND_BASE_URL=${BACKEND_BASE_URL}

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application files
FROM nginx:alpine
COPY . .
RUN npm run build

# Define the command to run your app
COPY --from=build /app/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]