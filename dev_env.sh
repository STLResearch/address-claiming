#!/bin/bash

PARAMATER="DEV_FRONTEND_ENV"
REGION="eu-north-1"

# Get parameters and put it into .env file inside application root
aws ssm get-parameter --with-decryption --name $PARAMATER --region $REGION | jq --raw-output '.Parameter.Value' >> .env.local