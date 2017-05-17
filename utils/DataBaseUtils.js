import mongoose from 'mongoose';
import fs from 'fs';
import bcrypt from 'bcrypt';
import '../models/Report';
import '../models/User';
import { dbUrl } from '../etc/config.json';

const Report = mongoose.model('Report');
const User = mongoose.model('User');

export function setUpConnection() {
  mongoose.Promise = global.Promise;
  mongoose.connect(dbUrl);
}

export function createUser(data) {
  const { username, email, password } = data;
  const passwordHash = bcrypt.hashSync(password, 10);
  const user = new User({
    username: username,
    email: email,
    password: passwordHash,
    createdAt: new Date(),
  });
  return user.save();
}

export function listReports() {
  return Report.find();
}

export function authUser(data) {
  return User.find({
    $or: [
      { username: data.identifier },
      { email: data.identifier },
    ],
  });
}

export function uploadImage(req, res) {

  function base64(file) {
    const bitmap = fs.readFileSync(file);
    return new Buffer(bitmap).toString('base64');
  }

  const myFile = req.file;
  const path = myFile.path;
  const base64str = base64(path);

  const report = new Report({
    type: req.body.type,
    image: base64str,
    street: req.body.street,
    number: req.body.number,
    comment: req.body.comment,
    createdAt: new Date(),
  });

  fs.unlinkSync(path);
  report.save();

  res.send(myFile);
}

export function deleteReport(id) {
  const query = { _id: `${id}` };
  return Report.remove(query);
}
