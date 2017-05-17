import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ReportSchema = new Schema({
  type: { type: String },
  image: { type: String },
  street: { type: String },
  number: { type: String },
  comment: { type: String },
  createdAt: { type: Date },
});

mongoose.model('Report', ReportSchema);
