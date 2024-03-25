import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';


import authRouter from './router/authentication';
import imagesRouter from './router/images';

import { MONGO_URL } from './helpers/secrets'

const app = express();


app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);

mongoose.connection.on('error', (error) => console.log(error))

app.on("connection", () => {

})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


app.use('/', authRouter);

app.use('/', imagesRouter);

