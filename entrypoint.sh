#!/bin/bash -e

export PORT=${PORT:-80}
envsubst '${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

if [ -z "$RAILS_MASTER_KEY" ] && [ ! -f /rails/config/master.key ]; then
  export SECRET_KEY_BASE=$(ruby -e "require 'securerandom'; puts SecureRandom.hex(64)")
fi

cd /rails && ./bin/rails db:prepare

exec supervisord -n -c /etc/supervisord.conf
