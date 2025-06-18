FROM --platform=linux/amd64 oven/bun AS build

WORKDIR /app

# Cache packages installation
COPY package.json package.json
COPY bun.lock bun.lock
COPY prisma ./prisma

RUN bun install

# Generate Prisma client
RUN bunx prisma generate

COPY ./src ./src

ENV NODE_ENV=production

RUN bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--target bun-linux-x64 \
	--outfile server \
	./src/index.ts

# OPTION 1: Use distroless/cc instead of nodejs - this supports native binaries
FROM --platform=linux/amd64 gcr.io/distroless/cc-debian11

# OPTION 2: Alternative - Use Bun's slim runtime (uncomment below and comment above)
# FROM --platform=linux/amd64 oven/bun:1-slim

WORKDIR /app

COPY --from=build /app/server server

# Copy the generated Prisma client
COPY --from=build /app/prisma/generated ./prisma/generated

# Copy the node_modules Prisma files as fallback
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma

ENV NODE_ENV=production

EXPOSE 9000
CMD ["./server"]