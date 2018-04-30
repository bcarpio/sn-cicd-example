
var CICD = require('./cicd');

var cicd = new CICD('server-options.json');
cicd.server();