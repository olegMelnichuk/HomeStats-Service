// letting know other scripts that it is test scripts
process.env.IS_TEST = true;

let mongoose = require("mongoose");
let Deployment = require('../models/deploymentLogs');
let config = require('config');
let crypto = require('crypto');
let fs = require('fs');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
let expect = chai.expect;

let rawData = fs.readFileSync('test/requestData.json');
let requestData = JSON.parse(rawData);

let lastDocId = '';
let currentDocId = '';
chai.use(chaiHttp);

describe('deployment', () => {
    beforeEach((done) => { //Before each test we empty the database
        Deployment.findOne({}, {}, { sort: { 'created_at': -1 } }, function(err, post) {
            lastDocId = post._id;
            done();
        });
    });

    /*
     * Test the /POST route
     */
    describe('--POST deploy (API)', () => {
        it('it should check secret, make deploy and write the data in DB', (done) => {
            let githubData = config.get('gitAutomation');
            let payload = JSON.stringify(requestData.payload);
            let serverKey = 'sha1=' + crypto.createHmac('sha1', githubData['API'].githubSecret).update(payload).digest('hex');
            chai.request(server)
                .post('/deploy/API')
                .set('X-Hub-Signature', serverKey)
                .send(requestData.payload)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    //res.body.should.have.property('errors');
                    //res.body.errors.should.have.property('pages');
                    //res.body.errors.pages.should.have.property('kind').eql('required');
                    done();
                });
        });
        it('checking the written data', (done) => {
            Deployment.findOne({}, {}, { sort: { 'created_at': -1 } }, function(err, post) {
                currentDocId = post._id;
                expect(lastDocId).to.not.equal(currentDocId);
                done();
            });
        });
        it('cleaning data', (done) => {
            Deployment.findByIdAndRemove(currentDocId, (err, doc) => {
                expect(doc._id.ObjectID).to.equal(currentDocId.ObjectID);
                done();
            });
        });
    });
});