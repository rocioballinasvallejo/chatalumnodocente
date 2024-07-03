import express, { Request, Response } from 'express';
import cors from 'cors';

// Lista para almacenar las respuestas de los clientes conectados
const clients: Response[] = [];
// const administrativos :  Response[] =[];
const app = express();
app.use(express.json());
app.use(cors());


app.get('/new-event', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    clients.push(res);

    req.on('close', () => {
        clients.splice(clients.indexOf(res), 1);
        res.end();
    });
});


app.post('/notificaciones', (req: Request, res: Response) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ success: false, error: "Mensaje es requerido" });
    }

    clients.forEach(client => {
        client.write(`event: notificacion\n`);
        client.write(`data: ${message}\n\n`);
    });

    res.status(201).json({ success: true });
});


app.post('/mensajes', (req: Request, res: Response) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ success: false, error: "Mensaje es requerido" });
    }

    clients.forEach(client => {
        client.write(`event: mensaje\n`);
        client.write(`data: ${message}\n\n`);
    });

    res.status(201).json({ success: true });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});
    