/**
* Copyright 2017 Comcast Cable Communications Management, LLC *
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at *
* http://www.apache.org/licenses/LICENSE-2.0 *
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License. */

'use strict';

global.__base = __dirname + '/';

var Hapi = require('hapi');

var app = new Hapi.Server({ debug: { request: ['info', 'debug', 'error', 'read'] } });
app.connection({ port: 8000 });

var malcolm        = require('malcolm');
var mathController = require('./controllers/math.js');

malcolm.init({
    raml:   'api/math.raml',
    jx:     'api/math.jx.json'
}, function(err) {
    if ( err ) { console.log('Malcolm initialization error:'); console.log(err); return; }

    // Add routes all at once
    malcolm.addHapiRoutes(app, module);

    // Or, add routes one at a time
    /*
    malcolm.addHapiRoute(app, '/version',              'GET',  mathController.getVersionNumber);
    malcolm.addHapiRoute(app, '/addallnumbers_get',    'GET',  mathController.addAllNumbers);
    malcolm.addHapiRoute(app, '/addallnumbers_post',   'POST', mathController.addAllNumbers);
    malcolm.addHapiRoute(app, '/generaterandomnumber', 'GET',  mathController.generateRandomNumber);
    */

    // malcolm-related routes; use your preferred URLs, if you include at all
    app.route({
        method: 'GET',
        path: '/vsn',
        handler: malcolm.hapiVersion
    });
    app.route({
        method: 'GET',
        path: '/doc',
        handler: malcolm.hapiDoc
    });
    app.route({
        method: 'POST',
        path: '/fakeDataResponse',
        handler: malcolm.hapiAddFakeDataResponse
    });
    app.route({
        method: 'DELETE',
        path: '/fakeDataResponse',
        handler: malcolm.hapiClearFakeDataResponse
    });

    app.start(function () {
        console.log('Server running at:', app.info.uri);
    });

    // Debugging:
    /*
    var table = app.table()
    table.forEach(function(route) {
        console.log(route.table);
    });
    */
});
