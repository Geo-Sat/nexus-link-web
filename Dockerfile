FROM node:20-alpine as builder

# Build arguments
ARG VITE_API_BASE_URL
ARG VITE_WS_BASE_URL

# Set environment variables for build
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_WS_BASE_URL=$VITE_WS_BASE_URL

WORKDIR '/app'

COPY ./package.json ./package-lock.json ./

RUN npm install --include=dev
RUN npm install typescript

COPY . .

RUN npm run build

FROM nginx:alpine

# Install gettext for envsubst
RUN apk add --no-cache gettext

COPY ./nginx/app.conf /etc/nginx/conf.d/configfile.template

COPY --from=builder /app/dist /usr/share/nginx/html

COPY inject-env.sh /inject-env.sh
RUN chmod +x /inject-env.sh

EXPOSE 3000

ENV PORT 3000
ENV HOST 0.0.0.0
ENV VITE_API_BASE_URL=""
ENV VITE_WS_BASE_URL=""

CMD sh -c "/inject-env.sh && envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"