const express = require('express');
const validate = require('../../middlewares/validate');
const gifValidation = require('../../validations/gif.validation');
const gifController = require('../../controllers/gif.controller');
const { protectedRoute } = require('../../middlewares/auth');

const router = express.Router();

router.route('/').post(protectedRoute, validate(gifValidation.upload), gifController.uploadGif);
router.route('/:id').get(protectedRoute, gifController.getFileList);
router.route('/download/:fileName').get(gifController.getFileByFileName);
router.route('/download/public/:fileName').get(gifController.getFileByFileName);
router.route('/').put(protectedRoute, validate(gifValidation.updateGif), gifController.updateGif);

module.exports = router;
