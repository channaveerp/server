import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import userRoute from './routes/user.js';

const app = express();

app.use(morgan('dev'));
app.use(express.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

const MONGODB =
  'mongodb+srv://mern:mern1234@cluster0.uoqewvt.mongodb.net/mern?retryWrites=true&w=majority';

const port = 5000;

app.get('/', (req, res) => {
  res.send('hello express');
});
app.use(express.json());

app.use('/users', userRoute);

mongoose
  .connect(MONGODB)
  .then(() => {
    app.listen(port, () => {
      console.log(`listening on port${port}`);
    });
  })
  .catch((err) => {
    console.log(`${err} did not connect`);
  });
