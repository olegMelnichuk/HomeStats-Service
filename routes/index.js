var express = require('express');
var router = express.Router();
var DeploymentLogs = require('../models/deploymentLogs');
//var shell = require('shelljs');
//var config = require('config');

/* GET home page. */
router.get('/', function(req, res, next) {
    var data = new DeploymentLogs({
        project: 'API',
        branch: 'master',
        status: true,
        commit_id: '2f0h55235d2g5',
        created_at: new Date().getTime(),
        updated_at: new Date().getTime()
    });
    //shell.exec(projectConfig.projectPath + 'deploy.sh');
    data.save(function(err) {
        if (err) throw err;
        console.log('Data saved successfully!');
    });
    res.status(200).send({ message: '200 OK' });


});

module.exports = router;