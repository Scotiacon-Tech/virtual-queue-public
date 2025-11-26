FROM node:22-alpine AS build
WORKDIR /app


RUN corepack enable

COPY . ./

RUN npm ci && npm run build

FROM node:22-alpine
WORKDIR /app

COPY --from=build /app/.output ./

ENV NODE_ENV=production
# Change the port and host
ENV PORT=80
ENV HOST=0.0.0.0

EXPOSE 80

CMD ["node", "/app/server/index.mjs"]