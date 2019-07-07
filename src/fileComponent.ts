import awsCloudFront from 'aws-cloudfront-sign';
import awsSDK from 'aws-sdk';
import os from 'os';
import fs from 'fs';

export function getFileLink(filename) {
  return new Promise(function (resolve, reject) {
    var options = { keypairId: process.env.CLOUDFRONT_ACCESS_KEY_ID, privateKeyPath: process.env.CLOUDFRONT_PRIVATE_KEY_PATH };
    var signedUrl = awsCloudFront.getSignedUrl(process.env.CLOUDFRONT_URL + filename, options);
    resolve(signedUrl);
  });
}

export function uploadFile(filename, fileDirectoryPath) {
  awsSDK.config.update({ accessKeyId: process.env.S3_ACCESS_KEY_ID, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY });
  const s3 = new awsSDK.S3();

  return new Promise(function (resolve, reject) {
    fs.readFile(fileDirectoryPath.toString(), function (err, data) {
      if (err) { reject(err); }
      s3.putObject({
        Bucket: '' + process.env.S3_BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
      }, function (err, data) {
        if (err) reject(err);
        resolve("succesfully uploaded");
      });
    });
  });
}