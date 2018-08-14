var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DeploymentLogsSchema = new Schema({
    project: String,
    branch: String,
    status: Boolean,
    commit_id: String,
    created_at: Date,
    updated_at: Date
});

var DeploymentLogs = mongoose.model('DeploymentLogs', DeploymentLogsSchema, 'DeploymentLogs');

module.exports = DeploymentLogs;