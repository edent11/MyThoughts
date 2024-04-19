
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser'

import authRouter from './router/authentication';
import imagesRouter from './router/images';
import thoughtsRouter from './router/thoughts';
import usersRouter from './router/users';





dotenv.config();  // Load environment variables from .env file 
const MONGO_URL = process.env.REACT_APP_MONGO_URL || '';  // Retrieve the environment variable 

const app = express();



// Enable CORS with options to allow specific origins and headers

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'session_token'],
    exposedHeaders: ['session_token']

}));


app.use(express.json());

app.use(bodyParser.urlencoded({
    parameterLimit: 100000,
    limit: '50mb',
    extended: true
}));

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.Promise = Promise;
mongoose.connect(MONGO_URL).then(() => console.log("connected to MongoDB")).catch(() => console.log("Ip is not authorized"));
mongoose.connection.on('error', (error) => console.log(error))





app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


app.use('/', authRouter);
app.use('/', imagesRouter);
app.use('/', thoughtsRouter);
app.use('/', usersRouter);

