require('dotenv').config();

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const PORT = process.env.PORT || 1364;

// MIME-типы для расширений файлов
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  let pathname = path.join(__dirname, parsedUrl.pathname);
  
  fs.stat(pathname, (err, stats) => {
    if (err) {
      serveFile(path.join(__dirname, '/index.html'), res);
      return;
    }

    if (stats.isDirectory()) {
      pathname = path.join(pathname, '/index.html');
      fs.stat(pathname, (err, stats) => {
        if (!err && stats.isFile()) {
          serveFile(pathname, res);
        } else {
          serveFile(path.join(__dirname, '/index.html'), res);
        }
      });
    } else if (stats.isFile()) {
      serveFile(pathname, res);
    }
  });
});

// Функция для отправки файла
function serveFile(pathname, res) {
  const ext = path.parse(pathname).ext;
  const contentType = mimeTypes[ext] || 'text/plain';

  fs.readFile(pathname, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.end(`Error getting the file: ${err}.`);
    } else {
      res.setHeader('Content-type', contentType);
      res.end(data);
    }
  });
}

// Запускаем сервер
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Serving files from ${__dirname}`);
});