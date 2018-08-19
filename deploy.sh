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
        for i in {1..5}
            do
                echo "waiting to stop $SERVICE service $i seconds"
                sleep 1;
                if [ "`systemctl is-active $SERVICE`" != "active" ]; then
                    done
                fi
                if [ $i = 5 ]; then
                    echo "fail to stop the $SERVICE service, will exiting with exitСode:1"
                    exit 1
                fi
            done
        #while [ "`systemctl is-active $SERVICE`" = "active" ]; do
        #    sleep 1; 
        #done
        echo "The $SERVICE service has been stopped, start to fetch new changes"
    else
        echo "The $SERVICE service is not running, start to fetch new changes"
    fi
}

start_service () {
    if [ "`systemctl is-active $SERVICE`" != "active" ]; then 
        echo "Starting the $SERVICE service"
        systemctl start $SERVICE

        for i in {1..5}
        do
            echo "waiting to start $SERVICE service $i seconds"
            sleep 1;
            if [ "`systemctl is-active $SERVICE`" = "active" ]; then
                done
            fi
            if [ $i = 5 ]; then
                echo "fail to start the $SERVICE service, exiting with exitCode:1"
                exit 1
            fi
        done

        #while [ "`systemctl is-active $SERVICE`"!="active" ]; do
        #    sleep 1; 
        #done
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