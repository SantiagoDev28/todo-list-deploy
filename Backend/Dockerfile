# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .


# Production stage
FROM node:18-alpine

WORKDIR /app

# Instalar solo dependencias de producción
COPY package*.json ./
RUN npm ci --only=production

# Copiar dist del builder
COPY --from=builder /app/dist ./dist

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start
CMD ["node", "src/index.js"]
