

var Promise = require('bluebird'),
    ObjectAssignDeep = require('object-assign-deep'),
    CICD = require('sn-cicd');

/*
    This module is extending sn-cicd (github.com/bmoers/sn-cicd)
    Feel free to add your code to below functions.
    
*/

CICD.prototype.createRemoteRepo = function (ctx, repoName) {
    return Promise.try(() => {
        /*
            code to create remote git repo if required
        */
    });
};

CICD.prototype.pendingPullRequest = function ({ ctx, repoName, from }) {
    return Promise.try(() => {
        /*
            code to check if there is already a pending pull request
        */
    });
};

CICD.prototype.raisePullRequest = function ({ ctx, requestor, repoName, from, to, title, description }) {
    return Promise.try(() => {
        /*
            code to raise a pull request
        */
    });
};


/**
 * Get all files of an application.
 *  The result contains all scoped and non-scoped files linked to an application
 * 
 * @param {Object} application 
 * @returns {Promise<Array>} a list of files
 */
CICD.prototype.getApplicationFiles = function (ctx) {
    return Promise.try(() => {
        /*
            code to export all "master" file information in a format of
            [{
                className: 'sys_script_include',
                sysId: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
            }]
        */
        return []; 
    });
        
};

CICD.prototype.convertBuildBody = function (body){
    return Promise.try(() => {
        /*
            whatever it needs to convert the inbound body to 
            the correct format to internally call buildUpdateSetOnBranch()
        */
        
        var requestParam = ObjectAssignDeep({
            requestor: {
                userName: null,
                fullName: null,
                email: null
            },
            atf: {
                name: null,
                accessToken: null
            },
            updateSet: null,
            application: {
                id: null,
                name: null,
                git: {
                    repository: null,
                    remoteUrl: null
                }
            },
            source: {
                name: null,
                accessToken: null
            },
            master: {
                name: null,
                accessToken: null
            },
            target: {
                name: null,
                accessToken: null
            }
        }, body);

        var options = {
            build: {
                requestor: requestParam.requestor
            },
            atf: {
                credentials: {
                    name: requestParam.atf.name,
                    oauth: {
                        accessToken: requestParam.atf.accessToken
                    }
                }
            },
            updateSet: requestParam.updateSet,
            application: {
                id: requestParam.application.id,
                name: requestParam.application.name,
                organization: "company",
                git: requestParam.application.git
            },
            host: {
                name: requestParam.source.name,
                credentials: {
                    oauth: {
                        accessToken: requestParam.source.accessToken
                    }
                }
            }
        };
        if (requestParam.master.name) {
            options.branch = {
                name: "master",
                host: {
                    name: requestParam.master.name,
                    credentials: {
                        oauth: {
                            accessToken: requestParam.master.accessToken
                        }
                    }
                }
            };
        }
        if (requestParam.target.name) {
            options.deploy = {
                host: {
                    name: requestParam.target.name,
                    credentials: {
                        oauth: {
                            accessToken: requestParam.target.accessToken
                        }
                    }
                }
            };
        }

        return options; 
    });
};

CICD.prototype.convertPullBody = function (body) {
    return Promise.try(() => {
        /*
           whatever it needs to convert the inbound body to 
           the correct format to internally call gitPullRequestUpdate()
       */
        return body;
    });
};

module.exports = CICD;