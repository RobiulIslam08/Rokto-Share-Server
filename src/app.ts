import { Application, Request, Response } from 'express';
import cors from 'cors';

import express from 'express';
import cookieParser from 'cookie-parser';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';

const app: Application = express();

//parser
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true, // Allow credentials (cookies)
  }),
);



// application routes
app.use('/api/v1', router);
app.get('/', (req: Request, res: Response) => {
  res.send('This is Rokto Share Website .  !');
});

//Not Found
app.use(notFound);
app.use(globalErrorHandler);


export default app;
