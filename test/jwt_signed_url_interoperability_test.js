/**
 * The file /resources/jwt-signed-urls.json is generated by a corresponding test in Atlassian Connect:
 * com.atlassian.plugin.connect.test.plugin.JwtSigningInteroperabilityTest (see the file for the most up-to-date reference)
 *
 */
var _ = require('lodash');
var fs = require('fs');
var Uri = require('jsuri');
var qs = require('qs');
var jwt = require('../lib/internal/jwt');
var assert = require('assert');

var file = __dirname + '/resources/jwt-signed-urls.json';
var testData = JSON.parse(fs.readFileSync(file, 'utf8'));

_.each(testData.tests, function (test) {

    describe(test.name, function () {

        var uri = new Uri(test.signedUrl);
        var queryString = qs.parse(uri.uriParts.query);
        var token = queryString.jwt;

        it('should decode', function (done) {
            // throws error if not valid
            jwt.decode(token, testData.secret, false);
            done();
        });

        it('should match canonical url', function(done) {
            var req = createRequest();
            var actualCanonicalUrl = jwt.createCanonicalRequest(req, false);
            assert.equal(actualCanonicalUrl, test.canonicalUrl);
            done();
        });

        it('should match qsh', function (done) {
            var req = createRequest();
            var actualQsh = jwt.createQueryStringHash(req, false);
            var decodedToken = jwt.decode(token, testData.secret, true);
            assert.equal(actualQsh, decodedToken.qsh);
            done();
        });

        function createRequest() {
            return {
                method: "GET",
                path: uri.path(),
                query: queryString
            };
        }
    });

});
