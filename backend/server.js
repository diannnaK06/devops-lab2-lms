const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const { createCourse, getCourses } = require('./courses');
const { checkAnswers } = require('./quiz');
const { registerUser } = require('./users');

const PORT = process.env.PORT || 3000;
const frontendDir = path.join(__dirname, '..', 'frontend');

createCourse(1, 'DevOps Fundamentals', 'Anna Smith');
createCourse(2, 'Introduction to Python', 'John Miller');
createCourse(3, 'Web Development Basics', 'Emily Brown');

const questions = [
  { correctAnswer: 'A' }
];

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript'
};

function sendJSON(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/api/courses') {
    return sendJSON(res, 200, getCourses());
  }

  if (
    req.method === 'POST' &&
    ['/api/quiz', '/api/register'].includes(req.url)
  ) {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
      if (body.length > 10000) {
        req.destroy();
      }
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);

        if (req.url === '/api/quiz') {
          if (
            !Array.isArray(data.answers) ||
            !data.answers.every(answer => typeof answer === 'string')
          ) {
            return sendJSON(res, 400, { error: 'Invalid answers' });
          }

          return sendJSON(res, 200, checkAnswers(questions, data.answers));
        }

        if (
          typeof data.username !== 'string' ||
          typeof data.password !== 'string'
        ) {
          return sendJSON(res, 400, { error: 'Invalid credentials' });
        }

        const user = registerUser(data.username, data.password);
        return sendJSON(res, 201, user);
      } catch (error) {
        return sendJSON(res, 400, { error: error.message });
      }
    });
    return;
  }

  if (req.method !== 'GET') {
    return sendJSON(res, 405, { error: 'Method not allowed' });
  }

  const files = {
    '/': 'index.html',
    '/index.html': 'index.html',
    '/style.css': 'style.css',
    '/app.js': 'app.js'
  };

  const file = files[req.url];

  if (!file) {
    return sendJSON(res, 404, { error: 'Not found' });
  }

  const filePath = path.join(frontendDir, file);

  fs.readFile(filePath, (error, content) => {
    if (error) {
      return sendJSON(res, 500, { error: 'Cannot load file' });
    }

    res.writeHead(200, {
      'Content-Type': mimeTypes[path.extname(file)] || 'text/plain'
    });
    res.end(content);
  });
});

if (require.main === module) {
 server.listen(PORT, '0.0.0.0', () => {
    console.log(`LearnSpace is running at http://localhost:${PORT}`);
  });
}

module.exports = { server };
