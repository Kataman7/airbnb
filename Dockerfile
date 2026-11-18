FROM nginx:alpine

COPY index.html styles.css data.js app.js /usr/share/nginx/html/

EXPOSE 80
