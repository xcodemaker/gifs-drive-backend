// const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
const { s3Client } = require('../utils/s3Client');
const { dbClient } = require('../utils/dbConnection');
// const fs = require('fs');
// const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const uploadGifToS3 = async (file, id) => {
  const fileKey = `${uuidv4()}_${file.name}`;
  try {
    const params = {
      Bucket: 'gifs-drive',
      Key: fileKey,
      Body: file.data,
    };
    const command = {
      TableName: 'UserFiles',
      Item: {
        id: {
          S: uuidv4(),
        },
        fileName: {
          S: file.name,
        },
        userId: {
          S: id,
        },
        tags: {
          L: [],
        },
        fileKey: {
          S: fileKey,
        },
        publicUrl: {
          S: `v1/gif/download/public/${fileKey}`,
        },
      },
      ReturnConsumedCapacity: 'TOTAL',
    };
    const data = await s3Client.putObject(params).promise();
    const result = await dbClient.putItem(command).promise();
    return { result, data };
  } catch (err) {
    return err;
  }
};

const updateGifInDB = async (body) => {
  try {
    const command = {
      TableName: 'UserFiles',
      Key: {
        id: {
          S: body.id,
        },
      },
      UpdateExpression: 'SET #tags =:tagsVal, #fileName =:fileNameVal',
      ExpressionAttributeNames: {
        '#tags': 'tags',
        '#fileName': 'fileName',
      },
      ExpressionAttributeValues: {
        ':tagsVal': {
          L: body.tags.map((item) => {
            return { S: item };
          }),
        },
        ':fileNameVal': {
          S: body.fileName,
        },
      },
    };
    const result = await dbClient.updateItem(command).promise();
    return { result };
  } catch (err) {
    return err;
  }
};

const getFileListFromDB = async (id) => {
  try {
    const command = {
      TableName: 'UserFiles',
      FilterExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': { S: id },
      },
    };
    const result = await dbClient.scan(command).promise();
    let fileArray = [];
    if (result && result.Items) {
      fileArray = result.Items.map((item) => {
        return {
          fileKey: item.fileKey.S,
          fileName: item.fileName.S,
          id: item.id.S,
          publicUrl: item.publicUrl.S,
          userId: item.userId.S,
          url: `v1/gif/download/${item.fileKey.S}`,
          tags: item.tags.L.map((tag) => {
            return tag.S;
          }),
        };
      });
    }
    return fileArray;
  } catch (err) {
    return err;
  }
};

const getFileByFileNameFromS3 = async (fileName) => {
  try {
    const params = {
      Bucket: 'gifs-drive',
      Key: fileName,
    };
    // const result = await s3Client.send(new GetObjectCommand(params));
    const data = s3Client.getObject(params).promise();
    return data;
  } catch (err) {
    return err;
  }
};

module.exports = {
  uploadGifToS3,
  getFileListFromDB,
  getFileByFileNameFromS3,
  updateGifInDB,
};
