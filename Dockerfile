FROM node:23-alpine AS build

WORKDIR /

COPY package.json package-lock.json ./

RUN npm install

COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Inject Railway environment variable into the build process
ARG REACT_APP_BACKEND_BASE_URL
ENV REACT_APP_BACKEND_BASE_URL=${REACT_APP_BACKEND_BASE_URL}

RUN npm run build


FROM nginx:alpine

COPY --from=build /build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
EXPOSE 80