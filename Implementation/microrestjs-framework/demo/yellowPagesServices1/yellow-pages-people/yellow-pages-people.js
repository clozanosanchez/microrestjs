'use strict';

module.exports.onCreateService = function onCreateService() {
    this.people = {
        Asier: '404296490',
        Amalia: '456350578',
        Anna: '493340044'
    };
};

module.exports.search = function search(request, response, sendFunction) {
    var target = request.getPathParameter('target');

    _searchPeople(target, this.people, function (searchResult) {
        response.setStatus(200).setBody(searchResult);
        sendFunction();
    });
};

function _searchPeople(target, people, callback) {
    var searchResult = {};

    Object.keys(people).filter(function (element, index, array) {
        return element.search(target) !== -1;
    }).forEach(function (element, index, array) {
        searchResult[element] = people[element];
    });

    callback(searchResult);
}
