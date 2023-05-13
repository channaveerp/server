import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import userRoute from './routes/user.js';
import dotenv from 'dotenv';

const app = express();

app.use(morgan('dev'));
app.use(express.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

const port = 5000;
dotenv.config();

app.get('/', (req, res) => {
  res.send('hello express');
});
app.use(express.json());

app.use('/users', userRoute);

mongoose
  .connect(process.env.MONGODB)
  .then(() => {
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(`${err} did not connect`);
  });
