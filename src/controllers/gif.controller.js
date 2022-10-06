/* eslint-disable no-console */
const httpStatus = require('http-status');
// const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { gifService } = require('../services');

const uploadGif = catchAsync(async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: 'No file uploaded',
      });
    } else {
      // Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
      const { gif } = req.files;
      const { id } = req.body;
      const result = await gifService.uploadGifToS3(gif, id);
      // send response
      res.status(httpStatus.CREATED).send({
        success: true,
        message: 'File is uploaded',
        data: {
          name: gif.name,
          mimetype: gif.mimetype,
          size: gif.size,
          result,
        },
      });
    }
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err);
  }
});

const getFileList = catchAsync(async (req, res) => {
  try {
    const result = await gifService.getFileListFromDB(req.params.id);
    // send response
    res.status(200).send({
      success: true,
      message: 'get file list success',
      data: {
        userId: req.params.id,
        fileList: result,
      },
    });
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err);
  }
});

const getFileByFileName = catchAsync(async (req, res) => {
  try {
    const data = await gifService.getFileByFileNameFromS3(req.params.fileName);
    // res.writeHead(200, {
    //   'Content-Type': 'image/gif; charset=UTF-8',
    // });

    // res.attachment(req.params.fileName);
    // fileStream.pipe(res);
    res.attachment(req.params.fileName); // Set Filename
    res.type(data.ContentType); // Set FileType
    res.send(data.Body);
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err);
  }
});

const updateGif = catchAsync(async (req, res) => {
  try {
    const result = await gifService.updateGifInDB(req.body);
    // send response
    res.status(200).send({
      success: true,
      message: 'file update success',
      data: result,
    });
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err);
  }
});

module.exports = {
  uploadGif,
  getFileList,
  getFileByFileName,
  updateGif,
};
