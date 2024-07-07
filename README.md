# Schedule Task Assignment

### Objective

The objective of this assignement is to demonstrate the ability to use AWS infrastructure and create a set of REST endpoints that will serve the purpose to create/update the schedule for the user and check whether the user is online for the particular timestamp or not.

### A brief description of the architecture and design decisions

The architecture consists of following resources.

Lambda, APIGateway, RDS Database - Postgres, S3 bucket, CloudWatch Logs, Serverless framework, Cloudformation (used by serverless)

#### High level overview

Serverless framework used to create infra-as-a-code with lambda layer, typescript build rocess and deployment with serverless command.

Request comes from the APIGateway endpoints. That invokes the invividual lambda. Lambda further based on the endpoint url and method assign the request to different handlers. for update endpoints it will execute the mutation logs in S3 bucket `user-schedule-task-${YOUR_AWS_ACCOUNT_ID}`

- for `createSchedule` and `updateSchedule` there will be different keys.
- each key has partition with `year/month/day/log-{timestamp}.json`
  Both lambda will be deployed in default VPC provided at the time of deployment. RDS will be automatically deployed to VPC.

#### Decision Making (Why lambda was created in VPC)

In order to communicate with RDS without any complex configuration, we're setting up the lambda in VPC. Because RDS by default is creating resource in default VPC. There is downside that from VPC we don't have access to outside internet. Hence it will be a problem to access S3 from lambda.

#### Decision Making (Why VPCEndpoint needs to be created)

We had to create VPCEndpoint in order to communicate with S3 as lambda was in VPC so that can't directly access S3 without creating VPCEndpoint.

#### Decision Making (Why 3 .env file was created)

Bacically one .env at the root can be possible. But as the project grows it becomes very difficult to handle in single file. Also Serverless provides the feature to read the outer serverless file to internal folder level serverless file. But there is one known issue running due to that we had to create to separate `.env` file for each lambda.

Ref: https://forum.serverless.com/t/unable-to-get-variables-when-files-are-in-different-folders/16390

### APIGateway Endpoints

- POST `schedule` - Creates the schedule for the given payload
- GET `schedule/{userId}` - Get the schedule record by userId
- GET `schedule/{userId}/check?timestamp=1720171800` - Check whether the user is online or not
- PATCH `schedule/{userId}` - Updates the user schedule

### Instructions to deploy the application

### Assumptions for the seteup

#### serverless cli

Assuming that you've already setup the serverless cli. If not please go to below page and install.

[Setup serverless cli](https://www.serverless.com/framework/docs-getting-started)

#### node.js version 18

Assuming that you're using node version 18 or more. Thoug its not hard requirement but I've built it with 18 and it looks stable.

### Folder structure

- **clayer:** common dependency layer for lambda
- **createSchedule:** contains lambda function code
- **updarteschedule:** contains lambda function code

### Pre-Requsite

Before running the infra you need to make sure you follow these steps in order to successfull execution and creation of the infra.

#### Before deployment:

Each lambda and root has `serverless.yml` file. On each file, look for the `provider.profile` section. Update that value with your AWS configured profile.

See: [Configure AWS Profile](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)

```
provider:
  name: aws
  runtime: nodejs18.x
  profile: aws_tejas <--- This one
  region: ${env:REGION}
```

Each lambda has its own `.env` file and there is one more `.env` at the root level. Each env file is being sourced by its local serverless.yml file. Create following file to their respective places.

###### .env file for root folder

```.env
file: ./.env

REGION=YOUR_REGION
AWS_ACCOUNT_ID=YOUR_AWS_ACCOUNT_ID

# RDS database user details
RDS_MASTER_USERNAME=RDS_DB_USERNAME
RDS_MASTER_PASSWORD=RDS_DB_PASSWORD

REGION=us-east-1
AWS_ACCOUNT_ID=700942841164

# required to create VPCEndpoint to access S3 from lambda available in VPC
VPC_ID=YOUR_AWS_ACCOUNT_DEFAULT_VPC_ID
SUBNET_ROUTE_TABLE_ID=YOUR_AWS_ACCOUNT_SUBNET_ROUTE_TABLE_ID

# for lambda to available in vpc
SUBNET_ID=YOUR_AWS_ACCOUNT_SUBNET_ID
SECURITY_GROUP_ID=YOUR_AWS_ACCOUNT_SECURITY_GROUP_ID
```

###### .env file for createSchedule lambda

```env
file: ./createSchedule/.env

REGION=YOUR_REGION
AWS_ACCOUNT_ID=YOUR_AWS_ACCOUNT_ID
```

###### .env file for updateSchedule lambda

```env
file: ./updateSchedule/.env

REGION=YOUR_REGION
AWS_ACCOUNT_ID=YOUR_AWS_ACCOUNT_ID
```

Once you setup these files, you need to run `sls deploy` command in follwing order.

- **Step1:** In Root folder execute `sls deploy`, this will create DB Instance, VPCEndpoint for S3 Access and set the required output variables.
- **Step2:** Once step1 is completed, go to `createSchedule` folder, execute `sls deploy`, this will create APIGateway endpoint, lambda with the environment
- **Step3:** Once step1 is completed, go to `updateSchedule` folder, execute `sls deploy`, this will create APIGateway endpoint, lambda with the environment

#### After deployment:

After successfull execution of all 3 steps, on each lambda you'll recieve the api endopints. You can note down those endopints and use them in the provided request files in order to test the endpoints without leaving the editor.

```
Deploying createSchedule to stage dev (us-east-1)

✔ Service deployed to stack createSchedule-dev (53s)

endpoints:
  POST - https://vfkbwzj1dc.execute-api.us-east-1.amazonaws.com/dev/schedule
  GET - https://vfkbwzj1dc.execute-api.us-east-1.amazonaws.com/dev/schedule/{userId}
  GET - https://vfkbwzj1dc.execute-api.us-east-1.amazonaws.com/dev/schedule/{userId}/check
functions:
  createSchedule: dev-createSchedule (908 kB)
```

Take the endpoints value and fill up the variable in the .http file.
example:

```
file: ./createSchedule/getScheduleRequests.http

@createScheduleBaseUrl = https://vfkbwzj1dc.execute-api.us-east-1.amazonaws.com/dev
```

same way from the output of updateSchedule lambda fill up the variable in every .http file

```
file: ./updateSchedule/updateScheduleRequests.http

@updateScheduleBaseUrl = https://pmljton2o8.execute-api.us-east-1.amazonaws.com/dev
@createScheduleBaseUrl = https://vfkbwzj1dc.execute-api.us-east-1.amazonaws.com/dev
```

#### Resource locations:

- S3 Bucket: `user-schedule-task-${YOUR_AWS_ACCOUNT_ID}`
- Cloudwatch:
  - `/aws/lambda/dev-createSchedule`
  - `/aws/lambda/dev-updateSchedule`
- RDS:
  - prefix: `schedule-task-common-dev`
