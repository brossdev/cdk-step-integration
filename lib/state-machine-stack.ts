import * as cdk from "@aws-cdk/core";
import * as sfn from "@aws-cdk/aws-stepfunctions";
import * as s3 from "@aws-cdk/aws-s3";
import * as tasks from "@aws-cdk/aws-stepfunctions-tasks";

interface StateMachineProps extends cdk.StackProps {
  readonly bucket: s3.IBucket;
  videoKey: string;
}

export class StateMachineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: StateMachineProps) {
    super(scope, id, props);

    const { bucket, videoKey } = props;

    const getSampleVideo = new tasks.CallAwsService(this, "GetSampleVideo", {
      service: "s3",
      action: "copyObject",
      parameters: {
        Bucket: bucket.bucketName,
        Key: videoKey,
        CopySource: `${bucket.bucketName}/raw/${videoKey}`,
      },
      iamResources: [bucket.arnForObjects("*")],
      iamAction: "s3:*",
    });

    const startTranscriptionJob = new tasks.CallAwsService(
      this,
      "StartTranscriptionJob",
      {
        service: "transcribe",
        action: "startTranscriptionJob",
        parameters: {
          Media: {
            MediaFileUri: `s3://${bucket.bucketName}/raw/${videoKey}`,
          },
          "TranscriptionJobName.$": "$$.Execution.Name",
          LanguageCode: "en-US",
          OutputBucketName: bucket.bucketName,
          OutputKey: "output/transcribe.json",
        },
        iamResources: ["*"],
      }
    );

    const wait20Seconds = new sfn.Wait(this, "Wait20Seconds", {
      time: sfn.WaitTime.duration(cdk.Duration.seconds(20)),
    });

    const checkIfTranscriptionDone = new tasks.CallAwsService(
      this,
      "CheckIfTranscriptionDone",
      {
        service: "transcribe",
        action: "getTranscriptionJob",
        parameters: {
          "TranscriptionJobName.$": "$.TranscriptionJob.TranscriptionJobName",
        },
        iamResources: ["*"],
      }
    );

    const getTranscriptionText = new tasks.CallAwsService(
      this,
      "GetTranscriptionText",
      {
        service: "s3",
        action: "getObject",
        parameters: {
          Bucket: bucket.bucketName,
          Key: "output/transcribe.json",
        },
        resultSelector: {
          "filecontent.$": "States.StringToJson($.Body)",
        },
        iamResources: [bucket.arnForObjects("*")],
      }
    );

    const prepareTranscriptTest = new sfn.Pass(this, "PrepareTranscriptTest", {
      parameters: {
        "transcript.$": "$.filecontent.results.transcripts[0].transcript",
      },
    });

    const startTextTranslation = new tasks.CallAwsService(
      this,
      "StartTextTranslation",
      {
        service: "translate",
        action: "translateText",
        parameters: {
          SourceLanguageCode: "en",
          TargetLanguageCode: "es",
          "Text.$": "$.transcript",
        },
        resultPath: "$.translate",
        iamResources: ["*"],
      }
    );

    const isTransactionDone = new sfn.Choice(this, "IsTransactionDone?")
      .when(
        sfn.Condition.stringEquals(
          "$.TranscriptionJob.TranscriptionJobStatus",
          "COMPLETED"
        ),
        getTranscriptionText
          .next(prepareTranscriptTest)
          .next(startTextTranslation)
      )
      .otherwise(wait20Seconds);

    const definition = getSampleVideo
      .next(startTranscriptionJob)
      .next(wait20Seconds)
      .next(checkIfTranscriptionDone)
      .next(isTransactionDone);

    new sfn.StateMachine(this, "TransalationStateMachine", {
      definition,
      tracingEnabled: true,
    });
  }
}
