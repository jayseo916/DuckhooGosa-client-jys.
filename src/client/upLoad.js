import AWS from "aws-sdk";

const albumBucketName = "duckhoogosa";
const bucketRegion = "ap-northeast-2";
const IdentityPoolId = "ap-northeast-2:ba805140-83ec-4793-8736-0641dd7d6f71";
let isDev = null;
if (process.env.REACT_APP_LOG === "TRUE") {
  isDev = true;
}

export function UploadToS3(problemTitle, file, callback) {
  let tokenId;
  if (localStorage["tokenId"] !== undefined) {
    tokenId = localStorage.getItem("tokenId");
    isDev && console.log(tokenId, "필요해");
  } else {
    throw Error("로그인 필요함");
  }
  // console.log("자격증명 토큰", { "accounts.google.com": authData.tokenId });
  AWS.config.update({
    region: bucketRegion,
    credentials: new AWS.CognitoIdentityCredentials({
      IdentityPoolId: IdentityPoolId,
      Logins: { "accounts.google.com": tokenId }
    })
  });

  var s3 = new AWS.S3({
    apiVersion: "2006-03-01",
    params: {
      Bucket: albumBucketName
    }
  });
  let fileName = file.name;
  let ProblemDirKey = encodeURIComponent(problemTitle) + "/";
  let photoKey = ProblemDirKey + fileName;
  return s3.upload(
    {
      Key: photoKey,
      Body: file,
      ACL: "public-read"
    },
    (err, data) => {
      if (err) {
        isDev && console.error(err);
        return alert("There was an error uploading your file: please login again. Sorry!", err.message);
      }
      isDev && console.log("Successfully uploaded photo.");
      if (callback) {
        callback(data.Location);
      }
      return data.Location;
    }
  );
}

// AWS.config.region = 'ap-northeast-2'; // 리전
// AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//   IdentityPoolId: 'ap-northeast-2:ba805140-83ec-4793-8736-0641dd7d6f71',
// });
