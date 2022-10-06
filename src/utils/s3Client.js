const AWS = require('aws-sdk');
// Set the region
AWS.config.update({ region: 'ap-south-1' });

// Create S3 service object
const s3Client = new AWS.S3({ apiVersion: '2006-03-01' });

module.exports.s3Client = s3Client;
