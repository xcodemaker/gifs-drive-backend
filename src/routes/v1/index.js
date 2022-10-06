const express = require('express');
const authRoute = require('./auth.route');
const gifRoute = require('./gif.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/gif',
    route: gifRoute,
  },
];
defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
