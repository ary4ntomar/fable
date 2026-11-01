import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import fs from "fs";
import path from "path";
import { env } from "../config/env";

const ai = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});

export async function createImage(
  userPrompt: string, //what kind of image to generate
  imageUrl: string, //user's reference image
  outputFilePath: string //where to save generated image
) {
  const imageResponse = await axios.get(imageUrl, {  // download the image from imageUrl , get it as a raw binary data , not json/text.
    responseType: "arraybuffer",
  });

  // why arraybuffer ? -- because an image is not normal text , it is a binary data , normal API response is in JSON , but img response is in binary bytes so we explictely tell axios to give raw image bytes.

  const base64Image = Buffer.from(imageResponse.data).toString("base64"); //  Convert raw image bytes into base64 string because Gemini receives inline image data as base64.

  //why ?? - because APIs often cannot receive raw image bytes directly inside JSON. so image bytes are encoded into a string format called base64.

  const headerContentType = imageResponse.headers["content-type"]; // read what type of image we download.

  const mimeType =                                  // if content type is string, use it . if it is an array , use first value . if nothing exists , fallback to image/png.
    typeof headerContentType === "string"
      ? headerContentType
      : Array.isArray(headerContentType)
      ? headerContentType[0] ?? "image/png"
      : "image/png";

  const prompt = [  //build gemini prompt , send gemini two things : text instruction and image data
    {
      text: userPrompt,  //text data
    },
    {
      inlineData: {    //img data
        mimeType,
        data: base64Image,
      },
    },
  ] as any;

  const response = await ai.models.generateContent({  //call gemini , ask gemini img model to generate content using our prompt
    model: "gemini-3.1-flash-image",
    contents: prompt,
  });

  const parts = response.candidates?.[0]?.content?.parts;  // Gemini may return text and/or image parts. We read the first candidate's parts.

  if (!parts) {
    throw new Error("Image generation failed: no parts returned");
  }

  for (const part of parts) {
    if (part.text) {
      console.log(part.text);
    }

    if (part.inlineData?.data) {
      const imageData = part.inlineData.data;                 // convert generated base64 image back to file
      const buffer = Buffer.from(imageData, "base64");

      const outputDir = path.dirname(outputFilePath);

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      fs.writeFileSync(outputFilePath, buffer);        //save generated image in local folder

      return outputFilePath;      //return the path where generated image was saved
    }
  }

  throw new Error("Image generation failed: no image returned");
}




// the worflow of this function ----

// export async function createImage(
//   userPrompt: string,
//   imageUrl: string,
//   outputFilePath: string
// ) {
  // 1. Download image from imageUrl

  // 2. Convert image to base64

  // 3. Send prompt + base64 image to Gemini

  // 4. Extract generated image from response

  // 5. Save generated image to outputFilePath

  // 6. Return outputFilePath
// }

// arraybuffer → get image as raw bytes
// Buffer → convert between bytes and base64
// candidates/content/parts → Gemini response structure
// inlineData.data → generated image base64
// fs/path → save file locally