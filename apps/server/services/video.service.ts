import { env } from "../config/env";
import type { CreateVideoResponse, PollVideoResponse } from "../types/video";

export async function generateVideo (userPrompt:string , imageUrls: string[] ) {


const headers = {
  Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
  'Content-Type': 'application/json',
};

// Step 1: Submit the generation request
const response = await fetch('https://openrouter.ai/api/v1/videos', {
  method: 'POST',
  headers,
  body: JSON.stringify({
    model: "x-ai/grok-imagine-video",
    prompt:userPrompt,
    duration: 5,
    resolution: "720p",
    aspect_ratio:"16:9" ,
    generate_audio:false,
    input_references : imageUrls.map(imageUrl =>({
        "type" : "image_url",
        "image_url" : {
            "url" : imageUrl
        }
    })) 
  }),
});

if (!response.ok) {
  const error = await response.text();
  throw new Error(`OpenRouter request failed: ${error}`);
}

const result = (await response.json()) as CreateVideoResponse;
if (!result.id || !result.polling_url) {
  throw new Error("Invalid response from OpenRouter");
}

const jobId = result.id;
const pollingUrl = new URL(
  result.polling_url,
  "https://openrouter.ai"
).toString();

console.log(`Job submitted: ${jobId}`);
console.log(`Status: ${result.status}`);

// Step 2: Poll until completion
 for (let attempt = 1; attempt <= 20; attempt++) {
  await new Promise(resolve => setTimeout(resolve, 30000));

  const pollResponse = await fetch(pollingUrl, { headers });

  if (!pollResponse.ok) {
    throw new Error("Failed to check video generation status");
  }

  const status = (await pollResponse.json()) as PollVideoResponse;

  // Keep your existing completed/failed checks here.
   console.log(`Status: ${status.status}`);
   console.log("Actual video generation cost:", status.usage?.cost);

  if (status.status === 'completed') {
    // Step 3: Download the video
    const contentUrl = status.unsigned_urls?.[0];
    if(!contentUrl) throw new Error ('video completed but no video URL returned');
    
    console.log(`video ready : ${contentUrl}`);

    const videoResponse = await fetch(contentUrl , { headers } );

    if(!videoResponse.ok){
      throw new Error("Failed to downlod generated video");
    }

    const contentType  = videoResponse.headers.get("content-type");
   
     if (!contentType) {
    throw new Error("Video content type is missing");
  }
      
    console.log("video content type:" , contentType) 
   
  if (!contentType.toLowerCase().includes("video/mp4")) {
  throw new Error(`Expected MP4, received: ${contentType}`);
}  

    const videoBuffer = Buffer.from(         //convert into a nodejs buffer
      await videoResponse.arrayBuffer()  // read the actual video bytes
    );

    return {
        jobId,
        videoBuffer,
        contentType
    };
    
  }
  else if (status.status === "failed"){
    throw new Error(`Generation failed : ${status.error ?? "unknown error"}`);
  }

  else if(status.status === "cancelled"){
    throw new Error(`Generation failed: ${status.error ?? "the job was cancelled" } `)
  }

  else if(status.status === "expired"){
    throw new Error(`Generation failed: ${status.error ?? "the job expired before completion" } `)
  }

} 
throw new Error("Video generation timed out");
}

// workflow -----

// 1. Takes prompt + imageUrls
// 2. Sends request to OpenRouter
// 3. Gets jobId and pollingUrl
// 4. Keeps checking every 30 seconds
// 5. When video is ready, gets videoUrl
// 6. Returns:
//    {
//      jobId,
//      videoUrl
//    }

// Receive prompt + image URLs
        // ↓
// Send POST request to OpenRouter
        // ↓
// Receive job ID and polling URL
        // ↓
// Poll every 30 seconds
        // ↓
// Receive completed video URL
        // ↓
// Return jobId + videoUrl