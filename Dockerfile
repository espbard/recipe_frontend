FROM node:23-alpine AS build

WORKDIR /

ARG BACKEND_BASE_URL
ENV BACKEND_BASE_URL=${BACKEND_BASE_URL}

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build


FROM nginx:alpine

COPY --from=build /build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]