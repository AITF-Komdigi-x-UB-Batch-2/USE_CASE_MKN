# Stage 1: Build the React/Vite application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package configurations and install dependencies
COPY package*.json ./
RUN npm ci

# Copy all source files and compile the production bundle
COPY . .
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:stable-alpine

# Copy static assets from build stage to Nginx HTML path
COPY --from=build /app/dist /usr/share/nginx/html

# Apply custom configuration to handle client-side routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
