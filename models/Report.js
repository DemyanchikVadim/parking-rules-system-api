import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const LinkSchema = new Schema({
  description: { type: String },
  tags: { type: String },
  image: { type: String },
  createdAt: { type: Date },
});

mongoose.model('Report', LinkSchema);
