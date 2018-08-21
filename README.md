# HomeStats-Service
This service called to help maintain the other projects.
For now implemented:
 * github auto deployment on push event. As a result you will be able to set the url: http://_domain_:_port_/deploy/_serviceName_ and set the secret key to authorize access for GitHub settings.

 * TBA

## Getting Started
Once you clone and install it please take care to create the deployLog.log file in a root of project. This file will serve to store log output for last deployment event.
Also there is example of config file (do not forget to set NODE_ENV=_configFilename_)
```
{
    "version": "",
    "port": 3000,
    "gitAutomation": { // part of github configurations
        "API": { // service name
            "githubSecret": "", // secret key from github webhook configuration
            "projectPath": "" // absolute path to project root folder 
        },
        "WEB": {
            "githubSecret": "",
            "projectPath": ""
        }
    },
    "dbAccess": { // access to mongoDB
        "dbName": "",
        "user": "",
        "pass": ""
    },
    "projectPath": "" // absolute path to current project
}
```

### Prerequisites
To create the service in OS I have used systremctl utility with help of next article:
* [Making Node.js service always alive on Ubuntu Server](https://hackernoon.com/making-node-js-service-always-alive-on-ubuntu-server-e20c9c0808e4)

## Contributing
* This project runs with Express but with a bit changes that reminds MVC pattern, so it can be developed more in that manner.
* the view folder I have kept for next features

## Authors
* **Oleg Melnichuk**

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc