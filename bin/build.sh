#!/bin/bash
set -euo pipefail

# Define current directory
DIR="${BASH_SOURCE%/*}"
if [[ ! -d "${DIR}" ]]; then DIR="${PWD}"; fi

export NODE_ENV="production"

echo -e "\n[Create Clean dist Directory]\n"
rm -rf "${DIR}/../dist"
mkdir -p "${DIR}/../dist/tmp"

echo -e "\n[Create Vue Client]\n"
"${DIR}/../node_modules/.bin/webpack" --config "${DIR}/../src/app/webpack/webpack.vue.client.config.js" --progress --hide-modules

echo -e "\n[Create Vue Server]\n"
"${DIR}/../node_modules/.bin/webpack" --config "${DIR}/../src/app/webpack/webpack.vue.server.config.js" --progress --hide-modules

echo -e "\n[Create App]\n"
"${DIR}/../node_modules/.bin/webpack" --config "${DIR}/../src/app/webpack/webpack.lambda.config.js" --progress --hide-modules

echo -e "\n[Create Origin Request]\n"
"${DIR}/../node_modules/.bin/webpack" --config "${DIR}/../src/origin-request/webpack.config.js" --progress --hide-modules

echo -e "\n[Create Viewer Request]\n"
"${DIR}/../node_modules/.bin/webpack" --config "${DIR}/../src/viewer-request/webpack.config.js" --progress --hide-modules

echo -e "\n[Create Custom RDS]\n"
"${DIR}/../node_modules/.bin/webpack" --config "${DIR}/../src/custom-rds/webpack.config.js" --progress --hide-modules

echo -e "\n[Create Pre-rendered Pages]\n"
node "${DIR}/create-pre-rendered-pages.js"

# Rebuild the client to support pwa fallback
echo -e "\n[Implement SWPrecacheWebpackPlugin Workaround]\n"
cp "${DIR}/../dist/static/pwa/index.html" "${DIR}/../dist/static/pwa.html"
"${DIR}/../node_modules/.bin/webpack" --config "${DIR}/../src/app/webpack/webpack.vue.client.config.js" --progress --hide-modules

echo -e "\n[Clean Up]\n"
rm -fr "${DIR}/../dist/tmp"
