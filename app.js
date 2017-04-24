import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import * as db from './utils/DataBaseUtils';
import { jwtSecret } from './etc/config.json';
import validateUsersData from './utils/validations/validateUsersData';

const upload = multer({ dest: __dirname + '/upload' });
const app = express();

db.setUpConnection();

app.use(bodyParser.json());

app.post('/api/upload', upload.single('file'), db.uploadImage);

app.post('/api/users', (req, res) => {
  validateUsersData(req.body).then(({ errors, isValid }) => {
    if (isValid) {
      db.createUser(req.body)
        .then(data => res.send(data))
        .catch(() => {
          res.status(500).json({
            errors: {
              global: 'Something is wrong here',
            },
          });
        });
    } else {
      res.status(400).json({ errors });
    }
  });
});

app.post('/api/auth', (req, res) => {
  db.authUser(req.body)
    .then((user) => {
      if (user.length) {
        if (bcrypt.compareSync(req.body.password, user[0].password)) {
          const token = jwt.sign({
            id: user[0]._id,
            username: user[0].username,
          }, jwtSecret);
          res.json({ token });
        } else {
          res.status(401).json({ errors: { global: 'Invalid Credentials' } });
        }
      } else {
        res.status(401).json({ errors: { global: 'Invalid Credentials' } });
      }
    })
    .catch(() => {
      res.status(500).json({
        errors: {
          global: 'Something is wrong here',
        },
      });
    });
});

app.get('/api/reports', (req, res) => {
  db.listReports()
    .then(data => res.send(data))
    .catch(() => {
      res.status(404).json({
        errors: {
          global: 'Something is wrong here',
        },
      });
    });
});

app.delete('/api/reports/:id', (req, res) => {
  db.deleteReport(req.params.id)
    .then(() => res.send({}))
    .catch(() => {
      res.status(500).json({
        errors: {
          global: 'Something is wrong here',
        },
      });
    });
});

app.use((req, res) => {
  res.status(404).json({
    errors: {
      global: 'Api method not found',
    },
  });
});

const server = app.listen(8080, () =>
  console.log('Server is up and running on port localhost:8080'),
);
