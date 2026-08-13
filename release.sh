#!/usr/bin/env bash
# Builds the app and publishes the build output as a GitHub Release,
# mirroring .github/workflows/release.yml but run locally via the GitHub REST API.
#
# Requires: GITHUB_TOKEN env var set to a personal access token with
# "contents: write" permission on the repo.
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

: "${GITHUB_TOKEN:?Set GITHUB_TOKEN to a GitHub personal access token with repo contents:write permission}"

BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ -n "$(git status --porcelain)" ]; then
  echo "Error: working tree has uncommitted changes. Commit or stash before releasing." >&2
  exit 1
fi

git fetch origin "${BRANCH}" --quiet
LOCAL_SHA=$(git rev-parse HEAD)
REMOTE_SHA=$(git rev-parse "origin/${BRANCH}" 2>/dev/null || echo "")
if [ "${LOCAL_SHA}" != "${REMOTE_SHA}" ]; then
  echo "Error: local ${BRANCH} differs from origin/${BRANCH}. Push your changes before releasing." >&2
  exit 1
fi

REPO=$(git config --get remote.origin.url | sed -E 's#(git@github.com:|https://github.com/)##; s#\.git$##')
SHA=$(git rev-parse --short HEAD)
TAG="$(date +'%Y.%m.%d')-${SHA}"
ASSET_NAME="skrida-${TAG}.zip"
BUILD_DIR="dist/skrida/browser"
REPO_ROOT="$(pwd)"

echo "Building..."
npm ci
npm run build

echo "Zipping ${BUILD_DIR} -> ${ASSET_NAME}"
rm -f "${ASSET_NAME}"
(cd "${BUILD_DIR}" && zip -rq "${REPO_ROOT}/${ASSET_NAME}" .)

api() {
  local method=$1 url=$2 data=${3:-}
  local response http_code body
  if [ -n "${data}" ]; then
    response=$(curl -s -w '\n%{http_code}' -X "${method}" \
      -H "Authorization: Bearer ${GITHUB_TOKEN}" \
      -H "Accept: application/vnd.github+json" \
      "${url}" -d "${data}")
  else
    response=$(curl -s -w '\n%{http_code}' -X "${method}" \
      -H "Authorization: Bearer ${GITHUB_TOKEN}" \
      -H "Accept: application/vnd.github+json" \
      "${url}")
  fi
  http_code=$(echo "${response}" | tail -n1)
  body=$(echo "${response}" | sed '$d')
  if [ "${http_code}" -ge 300 ]; then
    echo "GitHub API error (${http_code}) for ${method} ${url}:" >&2
    echo "${body}" >&2
    exit 1
  fi
  echo "${body}"
}

echo "Creating release ${TAG} on ${REPO}..."
RELEASE_JSON=$(api POST "https://api.github.com/repos/${REPO}/releases" "$(jq -n \
  --arg tag "${TAG}" \
  --arg sha "${LOCAL_SHA}" \
  '{tag_name: $tag, target_commitish: $sha, name: $tag, generate_release_notes: true}')")

UPLOAD_URL=$(echo "${RELEASE_JSON}" | jq -r '.upload_url' | sed -E 's/\{.*//')
RELEASE_URL=$(echo "${RELEASE_JSON}" | jq -r '.html_url')

echo "Uploading ${ASSET_NAME}..."
UPLOAD_RESPONSE=$(curl -s -w '\n%{http_code}' -X POST \
  -H "Authorization: Bearer ${GITHUB_TOKEN}" \
  -H "Content-Type: application/zip" \
  --data-binary @"${ASSET_NAME}" \
  "${UPLOAD_URL}?name=${ASSET_NAME}")
UPLOAD_HTTP_CODE=$(echo "${UPLOAD_RESPONSE}" | tail -n1)
if [ "${UPLOAD_HTTP_CODE}" -ge 300 ]; then
  echo "GitHub API error (${UPLOAD_HTTP_CODE}) uploading asset:" >&2
  echo "${UPLOAD_RESPONSE}" | sed '$d' >&2
  exit 1
fi

rm -f "${ASSET_NAME}"
echo "Released: ${RELEASE_URL}"
