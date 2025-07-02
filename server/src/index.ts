import express, { Request, Response } from 'express';
import { PORT } from './config';
import routes from './routes';

const app = express();

app.use(express.json());

app.use('/api', routes);

app.get('/testing', (req : Request, res : Response) => {
    res.send("This is the bignning of JV and Slayer Corporation");
})

app.listen(PORT, () => {
    console.log("server is running on", {port: PORT});
})
