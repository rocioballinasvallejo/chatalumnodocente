import express, { Response } from "express";
import { Request } from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
let notificationClients: Response[] = [];
let messageClients: Response[] = [];
const port = 8080;
app.listen(port, () => {
    console.log("Server is running on port 8080");
});

app.get("/New-Notifications", (req: Request, res: Response) => {
    res.setHeader('content-type', 'text/event-stream');
    res.setHeader('cache-control', 'no-cache');
    res.setHeader('connection', 'keep-alive');

    notificationClients.push(res);
    req.on('close', () => {
        res.end();
    });
});

app.post("/Notifications", (req: Request, res: Response) => {
    const message = req.body.message;
    for (let client of notificationClients) {
        client.write(`data:${message}\n\n`);
    }
    res.status(201).json({ success: true });
});

app.get("/New-Message", (req: Request, res: Response) => {
    res.setHeader('content-type', 'text/event-stream');
    res.setHeader('cache-control', 'no-cache');
    res.setHeader('connection', 'keep-alive');

    messageClients.push(res);
    req.on('close', () => {
        res.end();
    });
});

app.post("/Message", (req: Request, res: Response) => {
    const message = req.body.message;
    for (let client of messageClients) {
        client.write(`data:${message}\n\n`);
    }
    res.status(201).json({ success: true });
});