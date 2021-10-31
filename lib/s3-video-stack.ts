import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';

export class VideoBucketStack extends cdk.Stack {
    public readonly bucket: s3.IBucket;

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        this.bucket = new s3.Bucket(this, 'VideoBucket', {
            publicReadAccess: false,
            removalPolicy: cdk.RemovalPolicy.DESTROY
        });

    }
}   
