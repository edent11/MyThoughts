import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import router from './router/authentication';

const MONGO_URL = "mongodb+srv://edentamar2:TmsLgkhRbs13sk5k@mymovies.f808kvl.mongodb.net/MyMovies?retryWrites=true&w=majority&appName=MyMovies";

const app = express();


app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);

mongoose.connection.on('error', (error) => console.log(error))

app.on("connection", () => {
    console.log('first2')
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get("/hello", (req, res) => {
    res.send("hi 2you");
})
app.use('/', router);