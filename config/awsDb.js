const AWS = require("aws-sdk");

const getTemp = async (req, res) => {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "us-east-1",
  });

  const docClient = new AWS.DynamoDB.DocumentClient();
  const s3 = new AWS.S3();

  const dynamoDBParams = {
    TableName: "DHT",
  };

  const dynamoDBData = await new Promise((resolve, reject) => {
    docClient.scan(dynamoDBParams, async (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

  // List all objects in the S3 bucket
  const s3BucketName = "raspi-falldetector-img";

  const s3Params = {
    Bucket: s3BucketName,
  };

  const s3Data = await new Promise((resolve, reject) => {
    s3.listObjectsV2(s3Params, (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(data.Contents.map((obj) => obj.Key));
      }
    });
  });

  return {
    dynamoDBData,
    s3Data,
  };
};

const deleteTemp = async (req, res) => {
  const BUCKET = process.env.BUCKET; // Make sure BUCKET is correctly set in environment variables

  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "us-east-1",
  });

  const s3 = new AWS.S3();

  const filename = req.params.filename;

  try {
    await s3.deleteObject({ Bucket: BUCKET, Key: filename }).promise();
    res.send("File Deleted Successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error Deleting File");
  }
};

module.exports = { getTemp, deleteTemp };
