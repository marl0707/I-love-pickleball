FROM node:20-alpine
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package.json package-lock.json* ./
COPY prisma ./prisma/
RUN npm ci && npx prisma generate
COPY . .
EXPOSE 3000
ENV PORT=3000
CMD ["npm", "run", "dev"]
