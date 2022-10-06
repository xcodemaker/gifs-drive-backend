const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService } = require('../services');

const register = catchAsync(async (req, res) => {
  const { email, name } = req.body;
  const result = await authService.register(email, name);
  res.status(httpStatus.CREATED).send(result);
});

module.exports = {
  register,
};
