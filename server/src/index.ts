import express, { Request, Response } from 'express';
import { PORT } from './config';
import routes from './routes';
import twitterRoutes from './routes/twitter.route';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);
app.use('/api/twitter', twitterRoutes);

app.get('/testing', (req : Request, res : Response) => {
    res.send("This is the bignning of JV and Slayer Corporation");
})

app.listen(PORT, () => {
    console.log("server is running on", {port: PORT});
})
