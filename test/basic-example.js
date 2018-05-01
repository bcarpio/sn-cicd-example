

var CICD = require('../cicd');


var cicd = new CICD('server-options.json');

var settings = {
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
};

return cicd.convertBuildBody(settings).then((options) => {
    console.dir(options, {depth:null, colors:true});
    cicd.buildUpdateSetOnBranch(options);
});