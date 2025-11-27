FROM node:25-alpine

ENV ENVIRONMENT=start
ENV PORT=3000

WORKDIR /app

COPY package.json .

RUN npm install -g pnpm
RUN pnpm install

COPY . .

EXPOSE ${PORT}

RUN
CMD ["sh", "-c", "pnpm run ${ENVIRONMENT}"]