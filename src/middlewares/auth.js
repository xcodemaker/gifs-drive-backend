const { CognitoJwtVerifier } = require('aws-jwt-verify');

const verifier = CognitoJwtVerifier.create({
  userPoolId: 'us-east-1_5jo6QATXs',
  tokenUse: 'access',
  clientId: '606os718db1nqjrsueb9t00tve',
});

const protectedRoute = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    await verifier.verify(token);
    next();
  } catch (err) {
    res.status(401).json({
      error: new Error('Invalid request!'),
    });
  }
};

module.exports.protectedRoute = protectedRoute;
