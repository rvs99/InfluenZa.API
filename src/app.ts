import express, { Request, Response, NextFunction } from 'express';
import userRoutes from './routes/userRoutes'

const app = express();
const port = 3001;

// Middleware to parse incoming JSON data
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Use userRoutes to handle user-related APIs
app.use('/user', userRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  res.status(500).json({ error: 'Internal Server Error occured' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


