# Example implementation of the CICD Server for Service-Now

## Table of contents

- [Features](#features)
- [How to start](#how-to-start)
- [Star the CICD-Server](#star-the-cicd-server)
- [Basic Example](#basic-example)
- [Prerequisites](#prerequisites)
- [Contribute](#contribute)
- [Dependencies](#dependencies)

## Features

This is an example implementation of the [CICD Server](https://github.com/bmoers/sn-cicd) for [Service-Now](https://www.servicenow.com/). It allows to send changes captured in Update-Sets in Service-Now to a CICD pipeline including running ATF test cases.\
Example build results:
- [Code extraction](https://github.com/bmoers/sn-cicd-example/tree/master/example/repo)
- [ESLint report](http://htmlpreview.github.io/?https://github.com/bmoers/sn-cicd-example/blob/master/example/doc/lint/index.html)
- [JsDoc documentation](http://htmlpreview.github.io/?https://github.com/bmoers/sn-cicd-example/blob/master/example/doc/docs/global.module_sys_script_include.CicdDemo.html)

More information about the core module can be found here https://github.com/bmoers/sn-cicd#cicd-server-for-service-now

## How to start

Get a copy of this repo:

```bash
git clone git@github.com:bmoers/sn-cicd-example.git

cd sn-cicd-example
```

Edit `server-options.json` and set

- the directories
- if you're using slack, the slack web-hook (don't forget to set it active)
- the browser to be used to run the ATF test cases (if a UI session is required)
- a proxy if you're e.g. in a enterprise setup
- the hostname and port of the server to run

```json
{
    "gitRepoRootDir": "C:/cicd-server/repos", 
    "tempBuildRootDir": "C:/cicd-server/temp-build",
    "documentsRootDir": "C:/cicd-server/doc-root",
    "proxy": {
        "proxy": null,
        "strictSSL": null
    },
    "slack": {
        "active": false,
        "webhookUri": "https://hooks.slack.com/......",
        "channel": null
    },
    "browser": {
        "bin": "C:\\PROGRA~1\\INTERN~1\\iexplore.exe",
        "arg": [
            "-nomerge"
        ]
    },
    "server":{
        "port": 8080,
        "hostName": "http://localhost"
    }
}
```

## Star the CICD-Server

In sn-cicd-example run:

```bash
npm install
```

and:

```bash
npm start
```

The web-UI is available under http://localhost:8080/ (depending of your server-options settings).
It requires a run at least one build to display any information.

## Basic Example

1) Logon to a Service-Now instance. E.g. personal developer instance on https://developer.servicenow.com/
2) Create an Update-Set. Keep a copy of the sys_id.
3) Create an access token, either manually or with the below script. Keep a copy of the token. Please note, the token created with below script will only be valid for 30 minutes.

    ```js
    var now = new GlideDateTime(),
        oauth = new GlideRecord('oauth_credential');
    now.addSeconds((30 * 60)); // token valid for 30 min only!

    // create a token
    var token = "",
        chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (var i = 0; i < 86; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    oauth.setValue('peer', 'be57bb02533102006b0fc91a8dc5877c'); // ServiceNow Mobile App - for testing
    oauth.setValue('token', token);
    oauth.setValue('user', '6816f79cc0a8016401c5a33be04be441'); // admin
    oauth.expires = now;
    oauth.setValue('scopes', 'useraccount');
    oauth.setValue('type', 'access_token');
    oauth.setValue('client_id', '3e57bb02663102004d010ee8f561307a'); // ServiceNow Mobile App - for testing
    oauth.insert();
    gs.info("Use this token to connect {0}", token);
    ```
4) Create e.g. a script_include including JsDoc tags to be sent to the CICD pipeline.

    ```js
    /**
     * Class Description
     * 
     * @class 
     * @author Boris Moers [SRZXBX]
     * @memberof global.module:sys_script_include
     */
    var CicdDemo = Class.create();
    CicdDemo.prototype = /** @lends global.module:sys_script_include.CicdDemo.prototype */ {
        /**
         * Constructor
         * 
         * @returns {undefined}
         */
        initialize: function () { 
            
        },

        /**
         * A test function
         * 
         * @param {any} string the string to test
         * @returns {boolean} a true boolean
         */
        test: function (string) {

            return true;
        },
        type: 'CicdDemo'
    };
    ```

5) Add the 'host name', 'update set sys_id' and the 'access token' to the `test\basic-example.js` file like:

    ```js
    {
        "requestor": {
            "userName": "boris.moers",
            "fullName": "Boris Moers",
            "email": "boris.moers@gmail.com"
        },
        "updateSet": "250b3625db311300533b5385ca961979",
        "application": {
            "id": "00000000000000000000000000000001",
            "name": "Example Application",
            "git": {
                "enabled": false,
                "pullRequestEnabled": false
            }
        },
        "source": {
            "name": "https://dev57666.service-now.com/",
            "accessToken": "tyiwCTsYoKwf1N2IbxJ3uLRF5qkxrTpmUu73CV0oSkebTvwiaqaUIbwqpPoJiQSNjcNi5LD7fiCp6RLolGNqrl"
        }
    }
    ```
6) Make sure the settings in `server-options.json` are correct.
7) From the base directory run `node test\basic-example.js`
8) To browse the results run the server `npm start` and navigate to http://localhost:8080

## Configure Service-Now to 'build' and Update-Set

Add a business rule to send a REST message to your CICD-server.\
Post a payload like below to http://&lt;server.hostName&gt;:&lt;server.port&gt;/build.

```js
{
    "requestor": {  // information about the user raising the build
        "userName": null,
        "fullName": null,
        "email": null
    },
    "atf": {    // information to run ATF from remote
        "name": null,   //  the user-name under which the ATF test run
        "accessToken": null // temporary Oauth access token
    },
    "updateSet": null,  // ghe sys_id of the update-set to build
    "application": {    // the 'application' the Update-Set belongs to - does not need to be a scoped app, can be any.
        "id": null,     // any unique id.
        "name": null,   // the application name
        "git": {
            "repository": null, // the repo name
            "remoteUrl": null,  // the whole git URL for cloning
            "url": null,        // the whole git URL for browsing
            "enabled": false,   // git enabled at all
            "pullRequestEnabled": false // shall it raise pull requests for code review 
        }
    },
    "source": { // the Service-Now environment with the source-code of the update-set
        "name": null, // host-name
        "accessToken": null // temporary Oauth access token
    },
    "master": { // the Service-Now environment with the production data (normally your preprod or prod environment)
        "name": null, // host-name
        "accessToken": null // temporary Oauth access token
    },
    "target": { // the Service-Now environment to deploy the update-set to
        "name": null, // host-name
        "accessToken": null // temporary Oauth access token
    }
}
```

- If you dont want to pull from production, remove the "master" option in the json. 
- If you dont want to automatically deploy, remove the "target" option in the json.

A basic request payload would be:

```js
{
    "requestor": {
        "userName": "boris.moers",
        "fullName": "Boris Moers",
        "email": "boris.moers@gmail.com"
    },
    "atf": {
        "name": "test-user",
        "accessToken": "****************************************************************"
    },
    "updateSet": "6abca5340fd4a24007faebd692050e8d",
    "application": {
        "id": "00000000000000000000000000000001",
        "name": "Example Application",
        "git": {
            "repository": "example_application",
            "remoteUrl": "git@github.com:bmoers/example_application.git",
            "url": "https://github.com/bmoers/example_application.git",
            "enabled": true,
            "pullRequestEnabled": false
        }
    },
    "source": {
        "name": "https://cicd-example-host.service-now.com",
        "accessToken": "****************************************************************"
    }
}
```

## Prerequisites

1) Write a business rule to trigger the CICD pipeline from Service-Now
    - e.g. replace the "complete" value from the Update-Set screen with "Build"
2) If you're using the GIT feature:
    - make sure the current user has GIT correctly configured and can access the repo (SSH key)
    - implement the functions `createRemoteRepo()`, `pendingPullRequest()` and `raisePullRequest()`
2) If you want to deploy the update-set, create a REST API on source and target using https://github.com/bmoers/sn-cicd/blob/master/res/sn/sn-rest-api-deploy-us.js

## Contribute

If you want to contribute to this project, please fork the core project https://github.com/bmoers/sn-cicd 

## Project dependencies
The project is designed to use extensions. The core project [(bmoers/sn-cicd)](https://github.com/bmoers/sn-cicd) contains all 'shared' features. Customization which are dedicated to your Service-Now environment or CICD pipeline shall be added to the 'extending' project (like this one.)

### Dependencies

https://github.com/bmoers/sn-cicd-example  
--> extends  
https://github.com/bmoers/sn-cicd  
--> uses  
https://github.com/bmoers/sn-project  
https://github.com/bmoers/sn-rest-client

