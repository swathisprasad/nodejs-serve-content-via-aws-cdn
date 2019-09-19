import express from 'express';
import expressAuth from 'express-basic-auth';
import * as fileCtrl from './fileController';
import multer from 'multer';
import crypto from 'crypto';
import path from 'path';

const app = express();
const port = 3000;

app.use(expressAuth({
  users: { 'admin': 'admin' },
  unauthorizedResponse: getUnauthorizedResponse,
  challenge: true
}));

app.listen(port, () => {
  console.log('Server listening on port %s.', port);
});

function getUnauthorizedResponse(req) {
  return req.auth
    ? ('Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected')
    : 'No credentials provided';
}

var storage = multer.diskStorage({
  destination: './files',
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err);

      cb(null, raw.toString('hex') + path.extname(file.originalname));
    })
  }
})

app.use(multer({ storage: storage }).single('file'));


app.get('/api/download', asyncHandler(fileCtrl.download));
app.post('/api/upload', asyncHandler(fileCtrl.upload));

export function asyncHandler(handler) {
  return function (req, res, next) {
    if (!handler) {
      next(new Error(`Invalid handler ${handler}, it must be a function.`));
    } else {
      handler(req, res, next).catch(next);
    }
  };
}
