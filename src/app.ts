import { Application, Request, Response } from 'express';
import cors from 'cors';

import express from 'express';
const app: Application = express();

//parser
app.use(express.json());
app.use(cors());
app.get('/', (req: Request, res: Response) => {
  const a = 1;

  res.send(a);
});

export default app;
