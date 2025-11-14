FROM node:20-alpine as builder

WORKDIR '/app'

COPY ./package.json ./package-lock.json ./

RUN npm install --include=dev
RUN npm install typescript

COPY . .

RUN npm run build

FROM nginx:alpine

COPY ./nginx/app.conf /etc/nginx/conf.d/configfile.template

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 3000

ENV PORT 3000
ENV HOST 0.0.0.0

CMD sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"