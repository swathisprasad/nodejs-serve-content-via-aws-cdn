import { getFileLink, uploadFile } from './fileComponent';

export async function download(req, res) {
  let response = await getFileLink(req.query.filename);
  res.send(response);
  res.end();
}

export async function upload(req, res) {
  let response = await uploadFile(req.file.originalname, req.file.path);
  console.log(response)
  res.send(response);
  res.end();
}