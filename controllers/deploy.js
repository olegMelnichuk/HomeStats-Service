var express = require('express');

//var shell = require('shelljs');
//var config = require('config');

/* connect models */
var DeploymentLogs = require('../models/deploymentLogs');

exports.deploy = function(req, res, next) {
    var payload = 'Not a GitHub request';
    if (req.body.payload) {
        requestPayload = JSON.parse(req.body.payload);
    }
    var data = new DeploymentLogs({
        project: 'API',
        branch: 'master',
        status: true,
        commit_id: '2f0h55235d2g5',
        payload: payload,
        created_at: new Date().getTime(),
        updated_at: new Date().getTime()
    });
    res.data = data;
    next();
};

exports.save = function(req, res) {
    //shell.exec(projectConfig.projectPath + 'deploy.sh');
    res.data.save(function(err) {
        if (err) throw err;
        console.log('Data saved successfully!');
    });
    res.status(200).send({ message: '200 OK' });
};

/*
 exports.status = function(req, res) {
     res.status(200).send({ message: '200 OK (Get request has been done)' });
 }; 
*/