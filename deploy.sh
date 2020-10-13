#!/usr/bin/env sh

# abort on errors
set -e

# build
yarn build

# navigate into the build output directory
cd dist

git init
git add -A
git commit -m 'deploy'

# deploy to gh-pages
git push -f git@github.com:spenserblack/favlist.vue.git master:gh-pages

cd -
