# webpack-5-hmr-bug

This repo is for webpack issue [#13857](https://github.com/webpack/webpack/issues/13857)

Webpack 5.46.0 HMR client goes into an infinite reloading loop after restarting the server.
This only happens after starting the server, making a change that triggers HMR, then restarting.
