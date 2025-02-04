const http = require("node:http"),
    fs = require("node:fs"),
    mime = require("mime"),
    dir = "public/",
    port = 3000;

let todos = [];
let currentId = 1;

function calculateDeadline(priority, creationDate, customDeadline) {
    if (customDeadline) return new Date(customDeadline).toISOString();

    const date = new Date(creationDate);
    const days = priority === 'high' ? 2 : priority === 'medium' ? 5 : 7;
    date.setDate(date.getDate() + days);
    return date.toISOString();
}

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && !req.url.startsWith('/api/')) {
        const filename = dir + (req.url === "/" ? "index.html" : req.url);
        fs.readFile(filename, (err, data) => {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                return res.end('404 Not Found');
            }
            res.writeHead(200, {'Content-Type': mime.getType(filename)});
            res.end(data);
        });
        return;
    }

    if (req.url === '/api/todos') {
        if (req.method === 'GET') {
            res.writeHead(200, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify(todos));
        }
        
        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
                const todo = JSON.parse(body);
                todo.id = currentId++;
                todo.creationDate = new Date().toISOString();
                todo.deadline = calculateDeadline(todo.priority, todo.creationDate, todo.customDeadline);
                todo.completed = false;
                todos.push(todo);
                res.writeHead(201, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(todo));
            });
            return;
        }
    }

    if (req.url.startsWith('/api/todos/')) {
        const id = parseInt(req.url.split('/').pop());
        
        if (req.method === 'PATCH') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
                const update = JSON.parse(body);
                const todo = todos.find(t => t.id === id);
                if (todo) {
                    Object.assign(todo, update);
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify(todo));
                } else {
                    res.writeHead(404).end('Not found');
                }
            });
            return;
        }

        if (req.method === 'DELETE') {
            const initialLength = todos.length;
            todos = todos.filter(todo => todo.id !== id);
            res.writeHead(todos.length < initialLength ? 204 : 404).end();
            return;
        }
    }

    res.writeHead(404).end('Not found');
});

server.listen(port, () => console.log(`Server running at http://localhost:${port}/`));

