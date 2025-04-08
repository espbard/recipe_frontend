FROM node:23-alpine AS build

WORKDIR /

COPY package.json package-lock.json ./
COPY . .

RUN npm install
RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Inject Railway environment variable into the build process
ARG REACT_APP_BACKEND_BASE_URL
ENV REACT_APP_BACKEND_BASE_URL=${REACT_APP_BACKEND_BASE_URL}

FROM nginx:alpine

COPY --from=build /build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]