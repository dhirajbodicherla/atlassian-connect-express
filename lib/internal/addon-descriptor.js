var utils = require('./utils');

module.exports = function (addon) {
    var descriptorJson = utils.loadJSON(addon.config.descriptorFile());

    var firstPass = utils.replaceTokensInJson(descriptorJson, '{{localBaseUrl}}', addon.config.localBaseUrl());
    var secondPass = utils.replaceTokensInJson(firstPass, '{{environment}}', addon.config.environment());

    var finalResult = secondPass;
    if (typeof addon.config.descriptorTransformer === "function") {
        finalResult = addon.config.descriptorTransformer()(secondPass, addon.config);
    }
    return finalResult;
};
