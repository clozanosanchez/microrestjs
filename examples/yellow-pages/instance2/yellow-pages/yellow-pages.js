'use strict';

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

    if (filter === 'people') {
        yellowPagesPeopleService.execute(yellowPagesRequest).then((yellowPagesResponse) => {
            var body = {};
            body.people = yellowPagesResponse.getBody();

            response.setStatus(200).setBody(body);
            sendFunction();
            console.log(process.hrtime(time));
        }).catch((error) => {
            response.setStatus(500);
            sendFunction();
        });
    } else if (filter === 'companies') {
        yellowPagesCompaniesService.execute(yellowPagesRequest).then((yellowPagesResponse) => {
            var body = {};
            body.companies = yellowPagesResponse.getBody();

            response.setStatus(200).setBody(body);
            sendFunction();
            console.log(process.hrtime(time));
        }).catch((error) => {
            response.setStatus(500);
            sendFunction();
        });
    } else {
        Promise.all([yellowPagesPeopleService.execute(yellowPagesRequest), yellowPagesCompaniesService.execute(yellowPagesRequest)]).then((yellowPagesResponse) => {
            var body = {};
            body.people = yellowPagesResponse[0].getBody();
            body.companies = yellowPagesResponse[1].getBody();

            response.setStatus(200).setBody(body);
            sendFunction();
            console.log(process.hrtime(time));
        }).catch((error) => {
            response.setStatus(500);
            sendFunction();
        });
    }
};
