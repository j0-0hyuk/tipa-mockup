FROM nginx

ARG ENV=dev

WORKDIR /

COPY apps/web/dist /usr/share/nginx/html/app
COPY apps/make/dist /usr/share/nginx/html/make
COPY apps/admin/dist /usr/share/nginx/html/admin

RUN rm /etc/nginx/conf.d/default.conf

COPY apps/web/nginx/nginx.${ENV}.conf.template /etc/nginx/conf.d/nginx.conf.template

ENTRYPOINT ["/bin/bash", "-c", "set -euo pipefail; : \"${API_SERVER:?API_SERVER is required}\"; : \"${API_AI_SERVER:?API_AI_SERVER is required}\"; : \"${APP_DOMAIN:?APP_DOMAIN is required}\"; : \"${MAKE_DOMAIN:?MAKE_DOMAIN is required}\"; : \"${ADMIN_DOMAIN:?ADMIN_DOMAIN is required}\"; : \"${PROXY_SERVER:?PROXY_SERVER is required}\"; envsubst '${API_SERVER} ${API_AI_SERVER} ${APP_DOMAIN} ${MAKE_DOMAIN} ${ADMIN_DOMAIN} ${PROXY_SERVER}' < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/nginx.conf; nginx -t; exec nginx -g 'daemon off;'"]

EXPOSE 80 443
