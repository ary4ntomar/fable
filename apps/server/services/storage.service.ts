import { env } from "../config/env";
import { S3Client , PutObjectCommand , DeleteObjectCommand , GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
//s3-configuration
export const  s3 = new S3Client({
	region: "auto", // Required by SDK but not used by R2
	// Provide your Cloudflare account ID
	endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	// Retrieve your S3 API credentials for your R2 bucket via API tokens (see: https://developers.cloudflare.com/r2/api/tokens)
	credentials: {
		accessKeyId: env.R2_ACCESS_KEY_ID,
		secretAccessKey: env.R2_SECRET_ACCESS_KEY,
	},
});

//upload

export const uploadFile = async (file:Buffer, key:string, contentType:string) => {
    
const uploadInput = {
   Body: file,
   Bucket:env.R2_BUCKET_NAME,
   Key:key,
   ContentType: contentType
};

const uploadCommand = new PutObjectCommand(uploadInput);
const uploadResponse = await s3.send(uploadCommand);
return uploadResponse ;	
} 

//deleted

export const deleteFile = async (key:string)=>{

 const deleteInput = {
  Bucket: env.R2_BUCKET_NAME,
  Key:key
};

const deleteCommand = new DeleteObjectCommand(deleteInput);
const deleteResponse = await s3.send(deleteCommand);
return deleteResponse ;
}

//fetch

export const getSignedFileUrl = async (key:string)=>{

 const getInput = {
  Bucket: env.R2_BUCKET_NAME,
  Key:key
};

const getCommand = new GetObjectCommand(getInput);
return await getSignedUrl(s3, getCommand,{expiresIn:3600});
}
