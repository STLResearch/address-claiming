#!/bin/bash

PARAMATER="PROD_FRONTEND_ENV"
REGION="us-east-2"

# Get parameters and put it into .env file inside application root
aws ssm get-parameter --with-decryption --name $PARAMATER --region $REGION | jq --raw-output '.Parameter.Value' > .env.local