import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';

export class VideoBucketStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const videoBucket = new s3.Bucket(this, 'VideoBucket', {
            publicReadAccess: false,
            removalPolicy: cdk.RemovalPolicy.DESTROY
        });

        new cdk.CfnOutput(this, 'VideoBucketName', {
            value: videoBucket.bucketName,
            description: 'The name of the bucket we will store our video data',
            exportName: 'videoBucket',
        });
    }
}   
