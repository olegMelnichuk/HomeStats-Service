var express = require('express');
var router = express.Router();

/*Connect controllers*/
var deploy = require('../controllers/deploy');

router
//.get('/', deploy.status)
    .post('/:serviceName', deploy.check, deploy.make, deploy.save);

module.exports = router;