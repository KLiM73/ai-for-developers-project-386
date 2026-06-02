#!/bin/bash -e

export PORT=${PORT:-80}
envsubst '${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

cd /rails && ./bin/rails db:prepare

exec supervisord -n -c /etc/supervisord.conf
