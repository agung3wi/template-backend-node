#!/usr/bin/env bash
set -x
./stop-server.sh

# Add JRE to path
export JRE_PATH=`find node_modules/node-jre -type f -name java`
export JRE_PATH=`dirname $JRE_PATH`
export JRE_PATH=`pwd`/$JRE_PATH
export PATH=$JRE_PATH:$PATH
set -e
which java
java -version

# Start local dynamodb and offline plugins
export AWS_ACCESS_KEY_ID=foo
export AWS_SECRET_ACCESS_KEY=bar

export APP_KEY=493js7hdf87h238rnikscdnkMJDwejf
export DB_DRIVE=pg
export DB_HOST=localhost
export DB_USER=postgres
export DB_DATABASE=tulen
export DB_PASSWORD=bismillah
serverless dynamodb start --migrate &
sleep 5
nyc serverless offline --host=0.0.0.0 &
sleep 5
