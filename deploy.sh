#!/bin/sh
# Deploy bash script for any project

# The service name
SERVICE=$1
SERVICE_FOLDER=$2

#actions to stop the server and write the proper log
stop_service () {
    if [ "`systemctl is-active $SERVICE`" = "active" ]; then 
        echo "Stoping the $SERVICE service"
        systemctl stop $SERVICE
        while [ "`systemctl is-active $SERVICE`" = "active" ]; do
            sleep 1; 
        done
        echo "The $SERVICE service has been stopped, start to fetch new changes"
    else
        echo "The $SERVICE service is not running, start to fetch new changes"
    fi
}

start_service () {
    if [ "`systemctl is-active $SERVICE`" != "active" ]; then 
        echo "Starting the $SERVICE service"
        systemctl start $SERVICE
        while [ "`systemctl is-active $SERVICE`"!="active" ]; do
            sleep 1; 
        done
        echo "The $SERVICE service has been started, enjoy!"
    else
        echo "The $SERVICE service is running, enjoy!"
    fi
}

deploy_code () {
    cd $SERVICE_FOLDER
    git pull && echo "new changes were feched successfully!"
    start_service
    exit 0
}

stop_service
deploy_code