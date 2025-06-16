import http, { request } from 'http';
import { v4 } from 'uuid';

const port = 3000;
const grades = [
    { 
        studentName: "Lucas",
        subject: "Matemática",
        grade: 9.0, 
    
    },
]

const server = http.createServer( (request, response) => {
    const {method, url} = request;
    let body = '';

    request.on('data', (chunk) => {
        body += chunk.toString();
    });

    request.on('end', () => {
        const id = url.split('/')[2];

        if (method === 'GET' && url === '/grades') {
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(grades));

    }else if (method === 'POST' && url === '/grades') {
        const {studentName, subject, grade} = JSON.parse(body);
        const newGrade = {
            id: v4(),
            studentName,
            subject,
            grade
        };
        grades.push(newGrade);
        response.writeHead(201, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(newGrade));

    } else if (url.startsWith('/grades/') && method === 'PUT') {
        const {studentName, subject, grade} = JSON.parse(body);
        const gradeUptade = grades.find(g => g.id === id);
        if (gradeUptade) {
            gradeUptade.studentName = studentName;
            gradeUptade.subject = subject;
            gradeUptade.grade = grade;
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(gradeUptade));
        } else {
            response.writeHead(404, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({message:'Rota não encontrada'}));
        }
    } else if (url.startsWith('/grades/') && method === 'DELETE') {
        const index = grades.findIndex(g => g.id === id);
        if (index !== -1) {
            grades.splice(index, 1);
            response.writeHead(204);
            response.end();
        } else {
            response.writeHead(404, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({message:'Rota não encontrada'}));
        }
    }
    else {
        response.writeHead(404, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({message:'Rota não encontrada'}));
    }
});
    });

    

server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});