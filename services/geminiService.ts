
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {
  GoogleGenAI,
  Video,
  VideoGenerationReferenceImage,
  VideoGenerationReferenceType,
} from '@google/genai';
import {GenerateVideoParams, GenerationMode} from '../types';

// Fix: API key is now handled by process.env.API_KEY, so it's removed from parameters.
export const generateVideo = async (
  params: GenerateVideoParams,
): Promise<{objectUrl: string; blob: Blob; uri: string; video: Video}> => {
  const maxAttempts = 2;
  let attempt = 0;
  let lastError: any;

  while (attempt < maxAttempts) {
    attempt++;
    console.log(`Starting video generation (Attempt ${attempt}/${maxAttempts}) with params:`, params);

    try {
      // Fix: API key must be obtained from process.env.API_KEY as per guidelines.
      // Re-instantiate client per attempt to ensure freshness
      const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

      const config: any = {
        numberOfVideos: 1,
        resolution: params.resolution,
      };

      // Conditionally add aspect ratio. It's not used for extending videos.
      if (params.mode !== GenerationMode.EXTEND_VIDEO) {
        config.aspectRatio = params.aspectRatio;
      }

      const generateVideoPayload: any = {
        model: params.model,
        config: config,
      };

      // Only add the prompt if it's not empty.
      if (params.prompt) {
        generateVideoPayload.prompt = params.prompt;
      }

      if (params.mode === GenerationMode.FRAMES_TO_VIDEO) {
        if (params.startFrame) {
          generateVideoPayload.image = {
            imageBytes: params.startFrame.base64,
            mimeType: params.startFrame.file.type,
          };
          console.log(`Generating with start frame: ${params.startFrame.file.name}`);
        }

        const finalEndFrame = params.isLooping
          ? params.startFrame
          : params.endFrame;
        if (finalEndFrame) {
          generateVideoPayload.config.lastFrame = {
            imageBytes: finalEndFrame.base64,
            mimeType: finalEndFrame.file.type,
          };
          if (params.isLooping) {
            console.log(`Generating a looping video using start frame as end frame`);
          } else {
            console.log(`Generating with end frame: ${finalEndFrame.file.name}`);
          }
        }
      } else if (params.mode === GenerationMode.REFERENCES_TO_VIDEO) {
        const referenceImagesPayload: VideoGenerationReferenceImage[] = [];

        if (params.referenceImages) {
          for (const img of params.referenceImages) {
            console.log(`Adding reference image: ${img.file.name} (${img.file.type})`);
            referenceImagesPayload.push({
              image: {
                imageBytes: img.base64,
                mimeType: img.file.type,
              },
              referenceType: VideoGenerationReferenceType.ASSET,
            });
          }
        }

        if (params.styleImage) {
          console.log(`Adding style image as a reference: ${params.styleImage.file.name}`);
          referenceImagesPayload.push({
            image: {
              imageBytes: params.styleImage.base64,
              mimeType: params.styleImage.file.type,
            },
            referenceType: VideoGenerationReferenceType.STYLE,
          });
        }

        if (referenceImagesPayload.length > 0) {
          generateVideoPayload.config.referenceImages = referenceImagesPayload;
        }
      } else if (params.mode === GenerationMode.EXTEND_VIDEO) {
        if (params.inputVideoObject) {
          generateVideoPayload.video = params.inputVideoObject;
          console.log(`Generating extension from input video object.`);
        } else {
          throw new Error('An input video object is required to extend a video.');
        }
      }

      console.log('Submitting video generation request...', generateVideoPayload);
      let operation = await ai.models.generateVideos(generateVideoPayload);
      console.log('Video generation operation started:', operation);

      while (!operation.done) {
        await new Promise((resolve) => setTimeout(resolve, 10000));
        console.log('...Generating...');
        operation = await ai.operations.getVideosOperation({operation: operation});
        
        // Break early if error is detected during polling
        if (operation.error) break;
      }
      
      // Check for operation error specifically
      if (operation.error) {
        const err = operation.error as any;
        console.warn('Operation returned error:', JSON.stringify(err, null, 2));
        
        // Code 13 is Internal Error / Service Unavailable
        if (err.code === 13) {
          throw new Error('SERVICE_BUSY');
        }
        
        throw new Error(err.message || 'Unknown error from Veo API');
      }

      if (operation?.response) {
        const videos = operation.response.generatedVideos;

        if (!videos || videos.length === 0) {
          // Log full response structure to help debug safety filter hits or other issues
          console.warn('Received response but generatedVideos is empty. Response:', JSON.stringify(operation.response, null, 2));
          throw new Error('Video generation failed. The content was likely blocked by safety filters. Please try adjusting your prompt or reference images.');
        }

        const firstVideo = videos[0];
        if (!firstVideo?.video?.uri) {
          throw new Error('Generated video is missing a URI.');
        }
        const videoObject = firstVideo.video;

        const url = decodeURIComponent(videoObject.uri);
        console.log('Fetching video from:', url);

        const res = await fetch(`${url}&key=${process.env.API_KEY}`);

        if (!res.ok) {
          throw new Error(`Failed to fetch video: ${res.status} ${res.statusText}`);
        }

        const videoBlob = await res.blob();
        const objectUrl = URL.createObjectURL(videoBlob);

        return {objectUrl, blob: videoBlob, uri: url, video: videoObject};
      } else {
        throw new Error('No videos generated. Operation completed without response.');
      }

    } catch (error: any) {
      lastError = error;
      
      // If it's the custom service busy error and we have attempts left, retry
      if ((error.message === 'SERVICE_BUSY' || error.message.includes('internal server error')) && attempt < maxAttempts) {
        console.warn(`Attempt ${attempt} failed with internal service error. Retrying in 2 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        continue;
      }

      // If we are out of attempts or it's a different error, break loop
      break;
    }
  }

  // If we exit the loop, handle the last error
  if (lastError) {
    if (lastError.message === 'SERVICE_BUSY') {
       throw new Error('The video generation service is temporarily busy or encountered an internal error. Please try again in a moment.');
    }
    throw lastError;
  }

  throw new Error('Unexpected end of generation function');
};
