
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {Video} from '@google/genai';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  AspectRatio,
  GenerateVideoParams,
  GenerationMode,
  ImageFile,
  Resolution,
  VeoModel,
  VideoFile,
} from '../types';
import {
  ArrowRightIcon,
  PlusIcon,
  XMarkIcon,
  SparklesIcon,
  FilmIcon,
  TrashIcon
} from './icons';

const fileToBase64 = <T extends {file: File; base64: string}>(
  file: File,
): Promise<T> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      if (base64) {
        resolve({file, base64} as T);
      } else {
        reject(new Error('Failed to read file as base64.'));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};
const fileToImageFile = (file: File): Promise<ImageFile> =>
  fileToBase64<ImageFile>(file);

const ImageUpload: React.FC<{
  onSelect: (image: ImageFile) => void;
  onRemove?: () => void;
  image?: ImageFile | null;
  label: React.ReactNode;
  className?: string;
}> = ({onSelect, onRemove, image, label, className = "w-full h-32"}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imageFile = await fileToImageFile(file);
        onSelect(imageFile);
      } catch (error) {
        console.error('Error converting file:', error);
      }
    }
    if (inputRef.current) inputRef.current.value = '';
  };

  if (image) {
    return (
      <div className={`relative group ${className}`}>
        <img
          src={URL.createObjectURL(image.file)}
          alt="preview"
          className="w-full h-full object-cover rounded-lg shadow-inner border border-gray-700"
        />
        <button
          type="button"
          onClick={onRemove}
          title="Remove image"
          className="absolute top-2 right-2 w-8 h-8 bg-black/70 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors border border-white/20 z-10"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 text-[10px] text-center text-gray-300 truncate rounded-b-lg">
           {label}
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className={`${className} bg-[#1a1a1a] hover:bg-[#252525] border border-dashed border-gray-700 hover:border-amber-600/50 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:text-amber-500 transition-all duration-300 group`}
    >
      <div className="p-2 rounded-full bg-gray-800 group-hover:bg-amber-900/30 mb-2 transition-colors">
        <PlusIcon className="w-6 h-6" />
      </div>
      <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </button>
  );
};

interface PromptFormProps {
  onGenerate: (params: GenerateVideoParams) => void;
  initialValues?: GenerateVideoParams | null;
}

const PromptForm: React.FC<PromptFormProps> = ({
  onGenerate,
  initialValues,
}) => {
  // Inputs specific to "The Daily Bread" app
  const [visualPrompt, setVisualPrompt] = useState('');
  const [voiceOverScript, setVoiceOverScript] = useState('');
  const [musicAtmosphere, setMusicAtmosphere] = useState('');
  const [visualsImage, setVisualsImage] = useState<ImageFile | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<ImageFile | null>(null);

  // Core state for generation
  const [inputVideo, setInputVideo] = useState<VideoFile | null>(null);
  const [inputVideoObject, setInputVideoObject] = useState<Video | null>(null);
  
  // Determines if we are in "Create New" (Reference mode) or "Extend" mode
  const [generationMode, setGenerationMode] = useState<GenerationMode>(GenerationMode.REFERENCES_TO_VIDEO);

  useEffect(() => {
    if (initialValues) {
      // If we are coming from an Extend request
      if (initialValues.mode === GenerationMode.EXTEND_VIDEO) {
        setGenerationMode(GenerationMode.EXTEND_VIDEO);
        setInputVideo(initialValues.inputVideo ?? null);
        setInputVideoObject(initialValues.inputVideoObject ?? null);
        // We might want to keep the prompt empty for extension or allow user to type new prompt
        setVisualPrompt(''); 
      }
    } else {
      // Default to Create New (Reference Mode)
      setGenerationMode(GenerationMode.REFERENCES_TO_VIDEO);
    }
  }, [initialValues]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      // Construct the full prompt from the specialized fields
      // Visual Prompt is the main description
      let finalPrompt = visualPrompt.trim();
      
      // Voice Over is treated as SPOKEN WORDS
      if (voiceOverScript.trim()) {
        finalPrompt += ` The subject in the video is speaking the following words: "${voiceOverScript.trim()}".`;
      }
      
      if (musicAtmosphere.trim()) {
        finalPrompt += ` Atmosphere and pacing should fit music that is ${musicAtmosphere.trim()}.`;
      }

      // Collect reference images
      const refs: ImageFile[] = [];
      if (visualsImage) refs.push(visualsImage);
      if (backgroundImage) refs.push(backgroundImage);

      onGenerate({
        prompt: finalPrompt,
        model: VeoModel.VEO, // Ref2Video requires Veo 3.1
        aspectRatio: AspectRatio.LANDSCAPE, // Ref2Video requires 16:9
        resolution: Resolution.P720, // Ref2Video/Extend requires 720p
        mode: generationMode,
        referenceImages: refs,
        // Only used if mode is EXTEND
        inputVideo,
        inputVideoObject,
        startFrame: null,
        endFrame: null,
        styleImage: null,
        isLooping: false,
      });
    },
    [
      visualPrompt,
      voiceOverScript,
      musicAtmosphere,
      visualsImage,
      backgroundImage,
      generationMode,
      inputVideo,
      inputVideoObject,
      onGenerate,
    ],
  );

  // Extend Mode View
  if (generationMode === GenerationMode.EXTEND_VIDEO) {
    const canExtend = !!inputVideoObject;
    return (
       <div className="w-full max-w-2xl mx-auto bg-[#1a1a1a] rounded-xl border border-gray-800 p-8">
          <h3 className="text-lg font-serif text-gray-200 mb-6 flex items-center gap-2">
             <FilmIcon className="w-5 h-5 text-amber-500"/>
             Extend Previous Video
          </h3>
          
          <div className="mb-6 p-6 bg-black/40 rounded-lg border border-gray-700/50 flex flex-col items-center text-center">
             {inputVideo ? (
                <video src={URL.createObjectURL(inputVideo.file)} className="h-40 rounded mb-4" />
             ) : (
                <div className="h-40 w-64 bg-gray-800 rounded flex items-center justify-center text-gray-500 mb-4">No Video</div>
             )}
             <p className="text-sm text-gray-400">This will generate an additional 5 seconds matching the style of your previous clip.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
               <label className="block text-sm font-medium text-gray-400 mb-2">Prompt for Extension (Optional)</label>
               <input
                 type="text"
                 value={visualPrompt}
                 onChange={(e) => setVisualPrompt(e.target.value)}
                 placeholder="Describe what happens next..."
                 className="w-full bg-[#111] border border-gray-700 rounded-lg p-3 text-gray-200 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none placeholder-gray-600"
               />
            </div>
            <button
               type="submit"
               disabled={!canExtend}
               className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SparklesIcon className="w-5 h-5" />
              Generate Extension
            </button>
          </form>
       </div>
    );
  }

  // Reference to Video (Create New) View
  const isSubmitDisabled = !visualPrompt.trim() || (!visualsImage && !backgroundImage);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Left Column: Text Inputs */}
      <div className="lg:col-span-7 space-y-8">
        <form id="create-form" onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: The Verse */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-amber-500 font-serif text-lg font-medium tracking-wide">
                1. Visual Scene Description
              </label>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Main Prompt</span>
            </div>
            <p className="text-[10px] text-gray-600 -mt-2">
              Describe the subject's actions and the environment (e.g. vlogging to camera, looking at mountains).
            </p>
            <textarea
              value={visualPrompt}
              onChange={(e) => setVisualPrompt(e.target.value)}
              placeholder="e.g. A cinematic shot of a young man hiking up a misty mountain, stopping to look at the camera vlogging style, with a golden sunset in the background."
              className="w-full h-32 bg-[#1a1a1a] border border-gray-700 rounded-xl p-4 text-gray-200 placeholder-gray-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none resize-none text-lg leading-relaxed shadow-inner"
              required
            />
          </div>

          {/* Section 2: Atmosphere (Voice & Music) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-gray-400 font-medium text-sm block">
                  2. Voice Over (Script)
                </label>
                <textarea 
                  value={voiceOverScript}
                  onChange={(e) => setVoiceOverScript(e.target.value)}
                  placeholder="e.g. I am the bread of life. Whoever comes to me will never go hungry."
                  rows={3}
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg p-3 text-sm text-gray-200 focus:border-amber-500 outline-none resize-none"
                />
                <p className="text-[10px] text-gray-600">The subject will appear to be speaking these words (Video is silent)</p>
             </div>
             <div className="space-y-2">
                <label className="text-gray-400 font-medium text-sm block">
                  3. Music Atmosphere
                </label>
                <textarea 
                  value={musicAtmosphere}
                  onChange={(e) => setMusicAtmosphere(e.target.value)}
                  placeholder="e.g. Orchestral, Uplifting, Slow"
                  rows={3}
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg p-3 text-sm text-gray-200 focus:border-amber-500 outline-none resize-none"
                />
                <p className="text-[10px] text-gray-600">Influences visual mood (Video is silent)</p>
             </div>
          </div>

        </form>
      </div>

      {/* Right Column: Visual References */}
      <div className="lg:col-span-5 flex flex-col gap-6">
         
         <div className="space-y-4 bg-[#151515] p-6 rounded-xl border border-gray-800">
            <label className="text-amber-500 font-serif text-lg font-medium tracking-wide block">
              4. Visual References
            </label>
            <p className="text-xs text-gray-500 mb-4">
              Upload images to guide the AI. At least one image is required for this mode.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="flex flex-col gap-2">
                 <span className="text-xs font-medium text-gray-400 text-center">Subject / Visuals</span>
                 <ImageUpload
                    label="Add Subject"
                    image={visualsImage}
                    onSelect={setVisualsImage}
                    onRemove={() => setVisualsImage(null)}
                    className="w-full h-32"
                 />
               </div>
               <div className="flex flex-col gap-2">
                 <span className="text-xs font-medium text-gray-400 text-center">Background / Setting</span>
                 <ImageUpload
                    label="Add Background"
                    image={backgroundImage}
                    onSelect={setBackgroundImage}
                    onRemove={() => setBackgroundImage(null)}
                    className="w-full h-32"
                 />
               </div>
            </div>
         </div>

         {/* Submit Button */}
         <div className="mt-auto pt-4">
            <button
              form="create-form"
              type="submit"
              disabled={isSubmitDisabled}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:from-gray-700 disabled:to-gray-800 text-white font-medium py-4 px-6 rounded-xl transition-all shadow-lg shadow-black/50 disabled:shadow-none disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center gap-3">
                <span className="text-lg font-serif tracking-wide">Generate Video</span>
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
            <div className="mt-3 flex justify-between text-[10px] text-gray-600 px-2 uppercase tracking-widest">
               <span>Mode: Reference to Video</span>
               <span>Quality: 720p (High)</span>
            </div>
         </div>
      </div>

    </div>
  );
};

export default PromptForm;
