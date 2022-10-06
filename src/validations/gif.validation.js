const Joi = require('joi');

const upload = {
  body: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

const updateGif = {
  body: Joi.object().keys({
    id: Joi.string().required(),
    fileName: Joi.string().required(),
    tags: Joi.array().items(Joi.string()),
  }),
};

module.exports = {
  upload,
  updateGif,
};
