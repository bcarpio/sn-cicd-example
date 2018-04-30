# Example implementation of the CICD Server for Service-Now

## How to start ?

Get a copy of this repo:

```
git clone git@github.com:bmoers/sn-cicd-example.git

cd sn-cicd-example.git
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

```
nmp start
```

The Web-UI is available under http://localhost:8080/ (depending of your server-options settings).
It requires a run to display any information.

## Configure Service-Now to 'build' and Update-Set

Add a business rule to send a REST message to your CICD-server.

```json
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

```json
{
    "requestor": {
        "userName": "boris.moers",
        "fullName": "Boris Moers",
        "email": "boris_moers@gmail.com"
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

https://github.com/bmoers/sn-cicd-example\
--> extends\
https://github.com/bmoers/sn-cicd\
--> uses\
https://github.com/bmoers/sn-project\
https://github.com/bmoers/sn-rest-client

