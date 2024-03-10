const express = require('express');
const https = require('https');
const fs = require('fs');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const WebpackConfig = require('./webpack.config');

const app = express();
const compiler = webpack(WebpackConfig);

// Webpack Dev Middleware
app.use(webpackDevMiddleware(compiler, {
  publicPath: '/__build__/',
  stats: {
    colors: true,
    chunks: false
  }
}));

// Webpack Hot Middleware
app.use(webpackHotMiddleware(compiler));

// Serve static files
app.use(express.static(__dirname));

// Redirect all other requests to the root
app.use((req, res, next) => {
  res.redirect('/');
});

const port = process.env.PORT || 3000;

// Read SSL certificates
const privateKey = fs.readFileSync('/home/anh/Projects/vuex/localhost.key', 'utf8');
const certificate = fs.readFileSync('/home/anh/Projects/vuex/localhost.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Create an HTTPS server
const httpsServer = https.createServer(credentials, app);

// Start the server
httpsServer.listen(port, () => {
  console.log(`Server listening on https://localhost:${port}, Ctrl+C to stop`);
});
