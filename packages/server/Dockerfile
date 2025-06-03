# # Build stage
# FROM node:20-alpine AS builder

# WORKDIR /app

# # Install pnpm
# RUN npm install -g pnpm

# # Copy package files
# COPY package.json pnpm-lock.yaml ./
# COPY packages/server/package.json ./packages/server/
# COPY shared-dto/package.json ./shared-dto/

# # Install dependencies
# RUN pnpm install

# # Copy source code
# COPY . .

# # Build the application
# RUN pnpm nx build server

# # Production stage
# FROM node:20-alpine

# WORKDIR /app

# # Install pnpm
# RUN npm install -g pnpm

# # Copy package files and install production dependencies
# COPY package.json pnpm-lock.yaml ./
# COPY packages/server/package.json ./packages/server/
# COPY shared-dto/package.json ./shared-dto/
# RUN pnpm install --prod && \
#   pnpm add -D prisma

# # Copy built application
# COPY --from=builder dist/packages/server/src/main.js. /dist/packages/server

# # Copy Prisma schema and generate client
# COPY packages/server/prisma ./prisma
# RUN pnpm prisma generate

# EXPOSE 3000

# CMD ["node", "dist/packages/server/srcmain.js"] 


FROM node:20-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm

COPY package.json            pnpm-lock.yaml    ./
COPY nx.json                 tsconfig.base.json?  ./
COPY workspace.json?         ./
COPY shared-dto/package.json ./shared-dto/
COPY packages/server/package.json ./packages/server/

RUN pnpm install

COPY . .

RUN pnpm nx build server


FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/dist/packages/server/src   ./dist
COPY --from=builder /app/dist/packages/server/package.json ./dist/package.json

COPY --from=builder /app/packages/server/prisma    ./dist/prisma

WORKDIR /app/dist
RUN npm install --production

RUN npx prisma generate

EXPOSE 3000

CMD ["node", "main.js"]
