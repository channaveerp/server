import mongoose from 'mongoose';

export const tourSchema = mongoose.Schema({
  title: String,
  description: String,
  name: String,
  creator: String,
  tags: [String],
  imgaFIle: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
  likesCount: {
    type: Number,
    default: 0,
  },
});

const tourModal = mongoose.model('Tour', tourSchema);
export default tourModal;
