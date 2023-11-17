import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import userRoutes from './Routes/UserRoutes'
import facebookRoutes from './Routes/FacebookRoutes';

var cors = require('cors')

const app = express();
const port = 3001;

// Middleware to parse incoming JSON data
app.use(express.json());

const whitelist = ['http://localhost:3000', 'http://127.0.0.1:3000'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.options('*', cors(corsOptions));

app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/user', userRoutes);
app.use('/facebook', facebookRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  res.status(500).json({ error: 'Internal Server Error occured' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


