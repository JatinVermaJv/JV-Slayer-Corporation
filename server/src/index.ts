import express, { Request, Response } from 'express';

const app = express();
const port = 3001;

app.use(express.json());

app.get('/testing', (req : Request, res : Response) => {
    res.send("This is the bignning of JV and Slayer Corporation");
})

app.listen(port, () => {
    console.log("server is running on", {port});
})