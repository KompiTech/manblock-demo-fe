# build environment
FROM node:8.15.0 as builder
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN yarn --silent
ENV PATH /usr/src/app/node_modules/.bin:$PATH
RUN yarn run build
RUN find ./build/ -name '*.html' -o -name '*.js' -o -name '*.svg' -o -name '*.map' -o -name '*.css' -o -name '*.json' | xargs -n 1 gzip -f -k -9

# production environment
FROM nginx:1.15.8-alpine
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
