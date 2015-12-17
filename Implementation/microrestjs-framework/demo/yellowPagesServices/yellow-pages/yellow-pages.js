'use strict';

var async = require('async');

module.exports.search = function search(request, response, sendFunction) {
    var time = process.hrtime();

    var filter = request.getQueryParameter('filter');

    var yellowPagesPeopleService = this.getCallableService('yellow-pages-people');
    var yellowPagesCompaniesService = this.getCallableService('yellow-pages-companies');
    var yellowPagesRequest = {
        operation: 'search',
        parameters: {
            target: request.getPathParameter('target')
        }
    };

    async.parallel({
        people: function (callback) {
            if (!filter || filter === 'people') {
                yellowPagesPeopleService.execute(yellowPagesRequest, callback);
                return;
            }

            callback(null, undefined);
        },
        companies: function (callback) {
            if (!filter || filter === 'companies') {
                yellowPagesCompaniesService.execute(yellowPagesRequest, callback);
                return;
            }

            callback(null, undefined);
        }
    }, function (error, yellowPagesResponse) {
        if (error) {
            response.setStatus(500);
            sendFunction();
            return;
        }

        var body = {};
        if (yellowPagesResponse.people) {
            body.people = yellowPagesResponse.people.getBody();
        }

        if (yellowPagesResponse.companies) {
            body.companies = yellowPagesResponse.companies.getBody();
        }

        response.setStatus(200).setBody(body);
        sendFunction();
        console.log(process.hrtime(time));
    });
};
