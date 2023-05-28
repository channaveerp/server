import express from 'express';
import { createTour, getAllTour } from '../controllers/Tour.js';

const router = express.Router();

router.post('/', createTour);
router.get('/', getAllTour);

export default router;
