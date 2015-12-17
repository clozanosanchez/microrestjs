'use strict';

module.exports.onCreateService = function onCreateService() {
    this.companies = {
        Apple: '634958490',
        Apache: '590392578',
        'AT&T': '693342014'
    };
};

module.exports.search = function search(request, response, sendFunction) {
    var target = request.getPathParameter('target');

    _searchCompany(target, this.companies, function (searchResult) {
        response.setStatus(200).setBody(searchResult);
        sendFunction();
    });
};

function _searchCompany(target, companies, callback) {
    var searchResult = {};

    Object.keys(companies).filter(function (element, index, array) {
        return element.search(target) !== -1;
    }).forEach(function (element, index, array) {
        searchResult[element] = companies[element];
    });

    callback(searchResult);
}
