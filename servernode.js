const http = require('http');
const fs = require('fs');
const path = require('path');

// Указываем путь к директории с вашим сайтом
const publicDirectory = 'E:\\Всякое\\Доки и тд\\сайт дота';

// Функция для чтения и отправки файлов
const serveFile = (filePath, res) => {
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Файл не найден, отправляем 404
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                // Другая ошибка, отправляем 500
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            // Определяем MIME-тип
            let extname = path.extname(filePath);
            let contentType = 'text/html';

            switch (extname) {
                case '.js':
                    contentType = 'application/javascript';
                    break;
                case '.css':
                    contentType = 'text/css';
                    break;
                case '.json':
                    contentType = 'application/json';
                    break;
                case '.png':
                    contentType = 'image/png';
                    break;
                case '.jpg':
                    contentType = 'image/jpg';
                    break;
                case '.wav':
                    contentType = 'audio/wav';
                    break;
            }

            // Отправляем файл
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
};

// Создаем сервер
const server = http.createServer((req, res) => {
    // Определяем путь к файлу
    let filePath = path.join(publicDirectory, req.url === '/' ? 'index.html' : req.url);

    // Получаем расширение файла
    let extname = path.extname(filePath);

    // Если это директория, добавляем index.html
    if (!extname) {
        filePath = path.join(filePath, 'index.html');
    }

    // Читаем и отправляем файл
    serveFile(filePath, res);
});

// Указываем порт и запускаем сервер
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});