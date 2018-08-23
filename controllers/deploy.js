var express = require('express');

/* connect modules */
var shell = require('shelljs');
var config = require('config');
var crypto = require('crypto');
var bufferEq = require('buffer-equal-constant-time');

/* connect models */
var DeploymentLogs = require('../models/deploymentLogs');

exports.check = function(req, res, next) {
    var serviceName = req.params.serviceName;
    var githubData = config.get('gitAutomation');
    var payload = JSON.stringify(req.body);
    var serverKey = 'sha1=' + crypto.createHmac('sha1', githubData[serviceName].githubSecret).update(payload).digest('hex');
    var githubKey = req.headers['x-hub-signature'] || '';
    if (bufferEq(new Buffer(githubKey), new Buffer(serverKey))) {
        next();
    } else {
        res.status(401).send({ message: 'Signature is not matching! Please check the secret key' });
    }
};

exports.make = function(req, res, next) {
    var projectPath = config.get('projectPath');
    var gitAutomation = config.get('gitAutomation');
    var serviceName = req.params.serviceName;
    var repository = req.body.repository.default_branch;

    if (repository && repository.length != 0) {
        if (process.env.NODE_ENV != 'prod' || process.env.IS_TEST) {
            var data = new DeploymentLogs({
                project: serviceName,
                branch: repository,
                status: false,
                commit_id: req.body.commits[0].id,
                payload: req.body,
                created_at: new Date().getTime(),
                updated_at: new Date().getTime()
            });
            res.data = data;
            console.log('Updates were not deployed it is not prod or test is running');
            next();
        } else if (shell.exec('bash ' + projectPath + 'deploy.sh ' + serviceName + ' ' + gitAutomation[serviceName].projectPath + ' > ' + projectPath + 'deployLog.log').code == 0) {
            var data = new DeploymentLogs({
                project: serviceName,
                branch: repository,
                status: true,
                commit_id: req.body.commits[0].id,
                payload: req.body,
                created_at: new Date().getTime(),
                updated_at: new Date().getTime()
            });
            res.data = data;
            console.log('Updates were deployed successfully');
            next();
        } else {
            res.status(500).send({ message: 'Deployment bash script got failed please check the deployLog.log file' });
        }
    } else {
        res.status(200).send({ message: 'Testing is ok' });
    }
};


exports.save = function(req, res) {
    res.data.save(function(err) {
        if (err) throw err;
    });
    res.status(200).send({ message: '200 OK The updates were deployed successfully' });
};