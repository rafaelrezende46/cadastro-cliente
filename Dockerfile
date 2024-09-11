# Stage 1: Build the application
FROM node:20 as build

# Set the working directories for backend and frontend
WORKDIR /build

# Pass environment variables to the build stage
# DATABASE_URL is used by Prisma database migration
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# Copy both the backend and frontend folders to the container
COPY backend ./backend
COPY frontend ./frontend

# Install dependencies, run database migration and build the backend
WORKDIR /build/backend
RUN npm install
RUN npm run prismaDev
RUN npm run build

# Install dependencies and build the frontend
WORKDIR /build/frontend
RUN npm install
RUN npm run build

# Stage 2: Deploy the application
FROM node:20-alpine as deploy

# Set the working directory for the deploy stage
WORKDIR /app

# Copy backend's build output to the deploy folder
COPY --from=build /build/backend/dist/src ./src
COPY --from=build /build/backend/src/infra/prisma/schema.prisma ./src/infra/prisma
COPY --from=build /build/backend/package*.json ./

# Copy frontend's build output to the deploy folder's public directory
COPY --from=build /build/frontend/dist ./src/public

WORKDIR /app/src

# Install only production dependencies in the deploy stage for backend
RUN npm install --only=production
RUN npx prisma generate

# Set the entry point to run the backend application
CMD ["node", "index.js"]
