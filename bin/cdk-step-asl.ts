#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { StateMachineStack } from "../lib/state-machine-stack";
import { VideoBucketStack } from "../lib/s3-video-stack";

const app = new cdk.App();

const videoBucketStack = new VideoBucketStack(app, "VideoBucketStack", {});
new StateMachineStack(app, "StateMachineStack", {
  bucket: videoBucketStack.bucket,
  videoKey: "test2.mov",
});
