# Production Dockerfile for BHASHA SETU
FROM node:20-alpine

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies cleanly
RUN npm ci

# Copy all project source code and assets (respecting .dockerignore)
COPY . .

# Compile TypeScript and build production bundle
RUN npm run build

# Expose application port
EXPOSE 5173

ENV PORT=5173
ENV HOST=0.0.0.0

# Run production preview server with full backend Gemini translation API support
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
