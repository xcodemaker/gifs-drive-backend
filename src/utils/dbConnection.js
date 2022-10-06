const AWS = require('aws-sdk');
// Set the region
AWS.config.update({ region: 'ap-south-1' });

const dbClient = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

module.exports.dbClient = dbClient;
