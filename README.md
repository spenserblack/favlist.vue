# favlist.vue

[![CI](https://github.com/spenserblack/favlist.vue/actions/workflows/ci.yml/badge.svg?branch=v2)](https://github.com/spenserblack/favlist.vue/actions/workflows/ci.yml)

An :electron: electron app generated from [Deluze/electron-vue-template][template].

Manage lists with dynamic columns backed by a SQLite database.

## Previous Version

This is the new, Electron version of [favlist.vue][static site], which is a static site that I made
with the goal of having an easy-to-use interface to manage a list of things like my favorite movies.
The source code for the original version is in the `master` branch.

[rust favlist]: https://github.com/spenserblack/favlist
[static site]: https://spenserblack.github.io/favlist.vue/
[template]: https://github.com/Deluze/electron-vue-template

## Development

### Install Dependencies

```bash
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 yarn
```
