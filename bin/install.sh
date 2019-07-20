#!/bin/bash
set -euo pipefail

# Define current directory
DIR="${BASH_SOURCE%/*}"
if [[ ! -d "${DIR}" ]]; then DIR="${PWD}"; fi

# Install project dependencies
cd "${DIR}/../src/custom-rds" && npm ci && cd -
cd "${DIR}/../src/origin-request" && npm ci && cd -
cd "${DIR}/../src/viewer-request" && npm ci && cd -
cd "${DIR}/../" && npm ci && cd -
