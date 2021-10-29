import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';

export class VideoBucketStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //The code that defines your stack goes here
    new s3.Bucket(this, 'VideoBucket', {
      publicReadAccess: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });
 }
}   
