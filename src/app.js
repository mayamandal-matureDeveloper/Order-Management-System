import express from 'express';
import morgan from 'morgan';
import itemRoutes from './routes/router.js'
import { errorHandler } from '../../Node/src/middlewares/errorHandler.js';

export const app = express() ;

app.use(morgan('combined'));

app.use(express.json());

 // CORS Middleware - Allows the frontend to communicate with the API from a different origin
 app.use((req, res, next) => {
  const origin = req.headers.origin;
  // If the request has an origin, we reflect it back instead of using '*'
  if (origin) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    res.header('Access-Control-Allow-Origin', '*');
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight (OPTIONS) requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use('/api', itemRoutes)
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('API is running');
});
