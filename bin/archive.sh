#!/bin/bash
set -euo pipefail

# Define current directory
DIR="${BASH_SOURCE%/*}"
if [[ ! -d "${DIR}" ]]; then DIR="${PWD}"; fi

CACHE_CONTROL_ONE_YEAR="max-age=31536000, public"
CACHE_CONTROL_TWELVE_HOURS="max-age=43200, public"
CACHE_CONTROL_FIVE_MINUTES="max-age=300, public"

S3_BUCKET_NAME_ARTIFACTS="$(aws cloudformation list-exports --query 'Exports[?Name==`ServerlessAllTheThingsS3BucketArtifactsName`].Value' --output text)"
S3_BUCKET_NAME_STATIC="$(aws cloudformation list-exports --query 'Exports[?Name==`ServerlessAllTheThingsS3BucketStaticName`].Value' --output text)"
S3_PATH_ARTIFACTS_COMMIT="s3://${S3_BUCKET_NAME_ARTIFACTS}/${COMMIT}"
S3_PATH_STATIC_BRANCH_SLUG="s3://${S3_BUCKET_NAME_STATIC}/${BRANCH_SLUG}"
S3_PATH_STATIC_BRANCH_SLUG_ASSETS="${S3_PATH_STATIC_BRANCH_SLUG}/assets"

PATH_DIST="${DIR}/../dist"
PATH_DIST_STATIC="${PATH_DIST}/static"
PATH_DIST_STATIC_ASSETS="${PATH_DIST_STATIC}/assets"

cd "${PATH_DIST_STATIC}" && find . -type f -regextype posix-extended -regex "^.*\.(css|csv|gif|htm|html|ico|jpg|js|json|svg|txt|xml|webmanifest)$" -exec bash -c "cp {} {}.bak && gzip -9 {} && mv {}.bak {}" \; && cd -
cd "${PATH_DIST_STATIC}" && find . -type f -regextype posix-extended -regex "^.*\.(css|csv|gif|htm|html|ico|jpg|js|json|svg|txt|xml|webmanifest)$" -exec brotli "{}" \; && cd -

cd "${PATH_DIST}" zip -9qry "dist.zip" "./" && cd -
cd "${PATH_DIST}/app" && zip -9qry "lambda.zip" "./index.js" && cd -
cd "${PATH_DIST}/origin-request" && zip -9qry "lambda.zip" "./index.js" && cd -
cd "${PATH_DIST}/viewer-request" && zip -9qry "lambda.zip" "./index.js" && cd -
cd "${PATH_DIST}/custom-rds" && zip -9qry "lambda.zip" "./index.js" && cd -

aws s3 cp "${PATH_DIST}/app/lambda.zip" "${S3_PATH_ARTIFACTS_COMMIT}/app/lambda.zip"
aws s3 cp "${PATH_DIST}/origin-request/lambda.zip" "${S3_PATH_ARTIFACTS_COMMIT}/origin-request/lambda.zip"
aws s3 cp "${PATH_DIST}/viewer-request/lambda.zip" "${S3_PATH_ARTIFACTS_COMMIT}/viewer-request/lambda.zip"
aws s3 cp "${PATH_DIST}/custom-rds/lambda.zip" "${S3_PATH_ARTIFACTS_COMMIT}/custom-rds/lambda.zip"

# /*
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "*.css" --exclude "assets/*" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_TWELVE_HOURS}" --content-type "text/css"
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "*.csv" --exclude "assets/*" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_TWELVE_HOURS}" --content-type "text/csv"
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "*.gif" --exclude "assets/*" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_TWELVE_HOURS}" --content-type "image/gif"
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "*.ico" --exclude "assets/*" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_TWELVE_HOURS}" --content-type "image/x-icon"
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "*.jpg" --include "*.jpeg" --exclude "assets/*" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_TWELVE_HOURS}" --content-type "image/jpeg"
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "*.js" --exclude "assets/*" --exclude "service-worker.js" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_TWELVE_HOURS}" --content-type "application/javascript"
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "*.json" --exclude "assets/*" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_TWELVE_HOURS}" --content-type "application/json"
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "*.png" --exclude "assets/*" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_TWELVE_HOURS}" --content-type "image/png"
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "*.svg" --exclude "assets/*" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_TWELVE_HOURS}" --content-type "image/svg+xml"
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "*.txt" --exclude "assets/*" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_TWELVE_HOURS}" --content-type "text/plain"
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "*.xml" --exclude "assets/*" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_TWELVE_HOURS}" --content-type "application/xml"
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "*.webmanifest" --exclude "assets/*" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_TWELVE_HOURS}" --content-type "application/manifest+json"

# /*.br
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "*.css.br" --exclude "assets/*" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_TWELVE_HOURS}" --content-encoding "br" --content-type "text/css"
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "*.csv.br" --exclude "assets/*" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_TWELVE_HOURS}" --content-encoding "br" --content-type "text/csv"
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "*.gif.br" --exclude "assets/*" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_TWELVE_HOURS}" --content-encoding "br" --content-type "image/gif"
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "*.ico.br" --exclude "assets/*" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_TWELVE_HOURS}" --content-encoding "br" --content-type "image/x-icon"
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "*.jpg.br" --include "*.jpeg.br" --exclude "assets/*" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_TWELVE_HOURS}" --content-encoding "br" --content-type "image/jpeg"
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "*.js.br" --exclude "assets/*" --exclude "service-worker.js.br" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_TWELVE_HOURS}" --content-encoding "br" --content-type "application/javascript"
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "*.json.br" --exclude "assets/*" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_TWELVE_HOURS}" --content-encoding "br" --content-type "application/json"
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "*.png.br" --exclude "assets/*" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_TWELVE_HOURS}" --content-encoding "br" --content-type "image/png"
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "*.svg.br" --exclude "assets/*" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_TWELVE_HOURS}" --content-encoding "br" --content-type "image/svg+xml"
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "*.txt.br" --exclude "assets/*" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_TWELVE_HOURS}" --content-encoding "br" --content-type "text/plain"
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "*.xml.br" --exclude "assets/*" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_TWELVE_HOURS}" --content-encoding "br" --content-type "application/xml"
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "*.webmanifest.br" --exclude "assets/*" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_TWELVE_HOURS}" --content-encoding "br" --content-type "application/manifest+json"

# /*.gz
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "*.css.gz" --exclude "assets/*" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_TWELVE_HOURS}" --content-encoding "gzip" --content-type "text/css"
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "*.csv.gz" --exclude "assets/*" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_TWELVE_HOURS}" --content-encoding "gzip" --content-type "text/csv"
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "*.gif.gz" --exclude "assets/*" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_TWELVE_HOURS}" --content-encoding "gzip" --content-type "image/gif"
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "*.ico.gz" --exclude "assets/*" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_TWELVE_HOURS}" --content-encoding "gzip" --content-type "image/x-icon"
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "*.jpg.gz" --include "*.jpeg.gz" --exclude "assets/*" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_TWELVE_HOURS}" --content-encoding "gzip" --content-type "image/jpeg"
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "*.js.gz" --exclude "assets/*" --exclude "service-worker.js.gz" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_TWELVE_HOURS}" --content-encoding "gzip" --content-type "application/javascript"
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "*.json.gz" --exclude "assets/*" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_TWELVE_HOURS}" --content-encoding "gzip" --content-type "application/json"
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "*.png.gz" --exclude "assets/*" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_TWELVE_HOURS}" --content-encoding "gzip" --content-type "image/png"
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "*.svg.gz" --exclude "assets/*" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_TWELVE_HOURS}" --content-encoding "gzip" --content-type "image/svg+xml"
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "*.txt.gz" --exclude "assets/*" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_TWELVE_HOURS}" --content-encoding "gzip" --content-type "text/plain"
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "*.xml.gz" --exclude "assets/*" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_TWELVE_HOURS}" --content-encoding "gzip" --content-type "application/xml"
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "*.webmanifest.gz" --exclude "assets/*" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_TWELVE_HOURS}" --content-encoding "gzip" --content-type "application/manifest+json"

# /assets/*
aws s3 sync "${PATH_DIST_STATIC_ASSETS}" "${S3_PATH_STATIC_BRANCH_SLUG_ASSETS}" --exclude "*" --include "*.css" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_ONE_YEAR}" --content-type "text/css"
aws s3 sync "${PATH_DIST_STATIC_ASSETS}" "${S3_PATH_STATIC_BRANCH_SLUG_ASSETS}" --exclude "*" --include "*.csv" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_ONE_YEAR}" --content-type "text/csv"
aws s3 sync "${PATH_DIST_STATIC_ASSETS}" "${S3_PATH_STATIC_BRANCH_SLUG_ASSETS}" --exclude "*" --include "*.gif" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_ONE_YEAR}" --content-type "image/gif"
aws s3 sync "${PATH_DIST_STATIC_ASSETS}" "${S3_PATH_STATIC_BRANCH_SLUG_ASSETS}" --exclude "*" --include "*.htm" --include "*.html" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_ONE_YEAR}" --content-type "text/html; charset=utf-8"
aws s3 sync "${PATH_DIST_STATIC_ASSETS}" "${S3_PATH_STATIC_BRANCH_SLUG_ASSETS}" --exclude "*" --include "*.ico" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_ONE_YEAR}" --content-type "image/x-icon"
aws s3 sync "${PATH_DIST_STATIC_ASSETS}" "${S3_PATH_STATIC_BRANCH_SLUG_ASSETS}" --exclude "*" --include "*.jpg" --include "*.jpeg" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_ONE_YEAR}" --content-type "image/jpeg"
aws s3 sync "${PATH_DIST_STATIC_ASSETS}" "${S3_PATH_STATIC_BRANCH_SLUG_ASSETS}" --exclude "*" --include "*.js" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_ONE_YEAR}" --content-type "application/javascript"
aws s3 sync "${PATH_DIST_STATIC_ASSETS}" "${S3_PATH_STATIC_BRANCH_SLUG_ASSETS}" --exclude "*" --include "*.json" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_ONE_YEAR}" --content-type "application/json"
aws s3 sync "${PATH_DIST_STATIC_ASSETS}" "${S3_PATH_STATIC_BRANCH_SLUG_ASSETS}" --exclude "*" --include "*.png" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_ONE_YEAR}" --content-type "image/png"
aws s3 sync "${PATH_DIST_STATIC_ASSETS}" "${S3_PATH_STATIC_BRANCH_SLUG_ASSETS}" --exclude "*" --include "*.svg" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_ONE_YEAR}" --content-type "image/svg+xml"
aws s3 sync "${PATH_DIST_STATIC_ASSETS}" "${S3_PATH_STATIC_BRANCH_SLUG_ASSETS}" --exclude "*" --include "*.txt" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_ONE_YEAR}" --content-type "text/plain"
aws s3 sync "${PATH_DIST_STATIC_ASSETS}" "${S3_PATH_STATIC_BRANCH_SLUG_ASSETS}" --exclude "*" --include "*.xml" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_ONE_YEAR}" --content-type "application/xml"
aws s3 sync "${PATH_DIST_STATIC_ASSETS}" "${S3_PATH_STATIC_BRANCH_SLUG_ASSETS}" --exclude "*" --include "*.webmanifest" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_ONE_YEAR}" --content-type "application/manifest+json"

# /assets/*.br
aws s3 sync "${PATH_DIST_STATIC_ASSETS}" "${S3_PATH_STATIC_BRANCH_SLUG_ASSETS}" --exclude "*" --include "*.css.br" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_ONE_YEAR}" --content-encoding "br" --content-type "text/css"
aws s3 sync "${PATH_DIST_STATIC_ASSETS}" "${S3_PATH_STATIC_BRANCH_SLUG_ASSETS}" --exclude "*" --include "*.csv.br" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_ONE_YEAR}" --content-encoding "br" --content-type "text/csv"
aws s3 sync "${PATH_DIST_STATIC_ASSETS}" "${S3_PATH_STATIC_BRANCH_SLUG_ASSETS}" --exclude "*" --include "*.gif.br" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_ONE_YEAR}" --content-encoding "br" --content-type "image/gif"
aws s3 sync "${PATH_DIST_STATIC_ASSETS}" "${S3_PATH_STATIC_BRANCH_SLUG_ASSETS}" --exclude "*" --include "*.htm.br" --include "*.html.br" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_ONE_YEAR}" --content-encoding "br" --content-type "text/html; charset=utf-8"
aws s3 sync "${PATH_DIST_STATIC_ASSETS}" "${S3_PATH_STATIC_BRANCH_SLUG_ASSETS}" --exclude "*" --include "*.ico.br" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_ONE_YEAR}" --content-encoding "br" --content-type "image/x-icon"
aws s3 sync "${PATH_DIST_STATIC_ASSETS}" "${S3_PATH_STATIC_BRANCH_SLUG_ASSETS}" --exclude "*" --include "*.jpg.br" --include "*.jpeg.br" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_ONE_YEAR}" --content-encoding "br" --content-type "image/jpeg"
aws s3 sync "${PATH_DIST_STATIC_ASSETS}" "${S3_PATH_STATIC_BRANCH_SLUG_ASSETS}" --exclude "*" --include "*.js.br" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_ONE_YEAR}" --content-encoding "br" --content-type "application/javascript"
aws s3 sync "${PATH_DIST_STATIC_ASSETS}" "${S3_PATH_STATIC_BRANCH_SLUG_ASSETS}" --exclude "*" --include "*.json.br" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_ONE_YEAR}" --content-encoding "br" --content-type "application/json"
aws s3 sync "${PATH_DIST_STATIC_ASSETS}" "${S3_PATH_STATIC_BRANCH_SLUG_ASSETS}" --exclude "*" --include "*.png.br" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_ONE_YEAR}" --content-encoding "br" --content-type "image/png"
aws s3 sync "${PATH_DIST_STATIC_ASSETS}" "${S3_PATH_STATIC_BRANCH_SLUG_ASSETS}" --exclude "*" --include "*.svg.br" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_ONE_YEAR}" --content-encoding "br" --content-type "image/svg+xml"
aws s3 sync "${PATH_DIST_STATIC_ASSETS}" "${S3_PATH_STATIC_BRANCH_SLUG_ASSETS}" --exclude "*" --include "*.txt.br" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_ONE_YEAR}" --content-encoding "br" --content-type "text/plain"
aws s3 sync "${PATH_DIST_STATIC_ASSETS}" "${S3_PATH_STATIC_BRANCH_SLUG_ASSETS}" --exclude "*" --include "*.xml.br" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_ONE_YEAR}" --content-encoding "br" --content-type "application/xml"
aws s3 sync "${PATH_DIST_STATIC_ASSETS}" "${S3_PATH_STATIC_BRANCH_SLUG_ASSETS}" --exclude "*" --include "*.webmanifest.br" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_ONE_YEAR}" --content-encoding "br" --content-type "application/manifest+json"

# /assets/*.gz
aws s3 sync "${PATH_DIST_STATIC_ASSETS}" "${S3_PATH_STATIC_BRANCH_SLUG_ASSETS}" --exclude "*" --include "*.css.gz" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_ONE_YEAR}" --content-encoding "gzip" --content-type "text/css"
aws s3 sync "${PATH_DIST_STATIC_ASSETS}" "${S3_PATH_STATIC_BRANCH_SLUG_ASSETS}" --exclude "*" --include "*.csv.gz" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_ONE_YEAR}" --content-encoding "gzip" --content-type "text/csv"
aws s3 sync "${PATH_DIST_STATIC_ASSETS}" "${S3_PATH_STATIC_BRANCH_SLUG_ASSETS}" --exclude "*" --include "*.gif.gz" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_ONE_YEAR}" --content-encoding "gzip" --content-type "image/gif"
aws s3 sync "${PATH_DIST_STATIC_ASSETS}" "${S3_PATH_STATIC_BRANCH_SLUG_ASSETS}" --exclude "*" --include "*.htm.gz" --include "*.html.gz" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_ONE_YEAR}" --content-encoding "gzip" --content-type "text/html; charset=utf-8"
aws s3 sync "${PATH_DIST_STATIC_ASSETS}" "${S3_PATH_STATIC_BRANCH_SLUG_ASSETS}" --exclude "*" --include "*.ico.gz" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_ONE_YEAR}" --content-encoding "gzip" --content-type "image/x-icon"
aws s3 sync "${PATH_DIST_STATIC_ASSETS}" "${S3_PATH_STATIC_BRANCH_SLUG_ASSETS}" --exclude "*" --include "*.jpg.gz" --include "*.jpeg.gz" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_ONE_YEAR}" --content-encoding "gzip" --content-type "image/jpeg"
aws s3 sync "${PATH_DIST_STATIC_ASSETS}" "${S3_PATH_STATIC_BRANCH_SLUG_ASSETS}" --exclude "*" --include "*.js.gz" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_ONE_YEAR}" --content-encoding "gzip" --content-type "application/javascript"
aws s3 sync "${PATH_DIST_STATIC_ASSETS}" "${S3_PATH_STATIC_BRANCH_SLUG_ASSETS}" --exclude "*" --include "*.json.gz" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_ONE_YEAR}" --content-encoding "gzip" --content-type "application/json"
aws s3 sync "${PATH_DIST_STATIC_ASSETS}" "${S3_PATH_STATIC_BRANCH_SLUG_ASSETS}" --exclude "*" --include "*.png.gz" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_ONE_YEAR}" --content-encoding "gzip" --content-type "image/png"
aws s3 sync "${PATH_DIST_STATIC_ASSETS}" "${S3_PATH_STATIC_BRANCH_SLUG_ASSETS}" --exclude "*" --include "*.svg.gz" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_ONE_YEAR}" --content-encoding "gzip" --content-type "image/svg+xml"
aws s3 sync "${PATH_DIST_STATIC_ASSETS}" "${S3_PATH_STATIC_BRANCH_SLUG_ASSETS}" --exclude "*" --include "*.txt.gz" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_ONE_YEAR}" --content-encoding "gzip" --content-type "text/plain"
aws s3 sync "${PATH_DIST_STATIC_ASSETS}" "${S3_PATH_STATIC_BRANCH_SLUG_ASSETS}" --exclude "*" --include "*.xml.gz" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_ONE_YEAR}" --content-encoding "gzip" --content-type "application/xml"
aws s3 sync "${PATH_DIST_STATIC_ASSETS}" "${S3_PATH_STATIC_BRANCH_SLUG_ASSETS}" --exclude "*" --include "*.webmanifest.gz" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_ONE_YEAR}" --content-encoding "gzip" --content-type "application/manifest+json"

# Cache pwa.html for 300 seconds
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "pwa.html" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_FIVE_MINUTES}" --content-type "text/html; charset=utf-8"
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "pwa.html.br" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_FIVE_MINUTES}" --content-encoding "br" --content-type "text/html; charset=utf-8"
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "pwa.html.gz" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_FIVE_MINUTES}" --content-encoding "gzip" --content-type "text/html; charset=utf-8"

# Cache service-worker.js for 300 seconds
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "service-worker.js" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_FIVE_MINUTES}" --content-type "application/javascript"
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "service-worker.js.br" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_FIVE_MINUTES}" --content-encoding "br" --content-type "application/javascript"
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "service-worker.js.gz" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_FIVE_MINUTES}" --content-encoding "gzip" --content-type "application/javascript"

# Cache pre-rendered pages for 300 seconds
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "*.htm" --include "*.html" --exclude "assets/*" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_FIVE_MINUTES}" --content-type "text/html; charset=utf-8"
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "*.htm.br" --include "*.html.br" --exclude "assets/*" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_FIVE_MINUTES}" --content-encoding "br" --content-type "text/html; charset=utf-8"
aws s3 sync "${PATH_DIST_STATIC}" "${S3_PATH_STATIC_BRANCH_SLUG}" --exclude "*" --include "*.htm.gz" --include "*.html.gz" --exclude "assets/*" --no-guess-mime-type --metadata-directive REPLACE --cache-control "${CACHE_CONTROL_FIVE_MINUTES}" --content-encoding "gzip" --content-type "text/html; charset=utf-8"
