import tourModal from '../models/Tour.js';

// create a new tour
export const createTour = async (req, res) => {
  const tour = req.body;
  const newTour = new tourModal({
    ...tour,
    createdAt: new Date().toISOString(),
  });
  
  try {
    await newTour.save();
    res.status(201).json(newTour);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'something went wrong' });
  }
};

// getAll tour

export const getAllTour = async (req, res) => {
  try {
    const tour = await tourModal.find();
    res.status(200).json(tour);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'something went wrong' });
  }
};
