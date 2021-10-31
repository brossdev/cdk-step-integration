# CDK version of the Demo used in the FooBar Serverless video demonstrating the recently announced Sevice integrations with Step Functions

## Introduction

This project demonstrates how you can use the CDK to create a state machine to transcribe an english video into spanish without writing your own lambdas thanks to the newly introduced SDK integration for Step Functions.

To learn more about the SDK integrations with Step Functions i would suggest having a look at the blog post and video below:

https://aws.amazon.com/blogs/aws/now-aws-step-functions-supports-200-aws-services-to-enable-easier-workflow-automation/

https://www.youtube.com/watch?v=jtmQJqaInT0

This Repository will create two stacks for you:

1. S3 Video Bucket Stack - An S3 bucket used to store the video and the transcription
2. State Machine Stack - Store the step functions used to transcribe the video

## Prerequisites

Active AWS Credentials

To demonstrate the transcription, you will need to create a short video in English that we can use as the source of the transcription

## Test

to deploy this project from the root directory

```zsh
npm i
npx cdk deploy "*"
```

1. After successful deployment, in the newly created S3 bucket ( shown as part of the output from the cdk stack) with the new test.mov in the raw/ directory
2. Log into the step functions dashboard in the AWS console, and find your state machine.
3. Once selected click on start execution in the top right hand corner, for the purpose of this demo we don't use any input parameters so you can select start execution
4. If all steps run successfully you should be able to click on the step output of the Start Text Translation Step and see the spanish translation.
