
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { Video } from '@google/genai';
import React, { useCallback, useEffect, useState } from 'react';
import ApiKeyDialog from './components/ApiKeyDialog';
import { loadHistoryFromStorage, saveHistoryToStorage, saveVideoToDownloads, formatVideoFilename } from './storage';
import Dashboard from './components/Dashboard';
import { PlusIcon, ArrowLeftIcon, LayoutGridIcon } from './components/icons';
import LoadingIndicator from './components/LoadingIndicator';
import PromptForm from './components/PromptForm';
import VideoResult from './components/VideoResult';
import { generateVideo } from './services/geminiService';
import {
  AppState,
  AspectRatio,
  GenerateVideoParams,
  GenerationMode,
  Resolution,
  VideoFile,
  VideoHistoryItem,
} from './types';

const App: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'create'>('dashboard');
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // History state to track all generated videos for the dashboard
  const [history, setHistory] = useState<VideoHistoryItem[]>(() => {
    // Load history from localStorage on mount
    return loadHistoryFromStorage();
  });

  // Last generation state for retries and extensions
  const [lastConfig, setLastConfig] = useState<GenerateVideoParams | null>(null);
  const [lastVideoObject, setLastVideoObject] = useState<Video | null>(null);
  const [lastVideoBlob, setLastVideoBlob] = useState<Blob | null>(null);

  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState<GenerateVideoParams | null>(null);

  useEffect(() => {
    const checkApiKey = async () => {
      if (window.aistudio) {
        try {
          if (!(await window.aistudio.hasSelectedApiKey())) {
            setShowApiKeyDialog(true);
          }
        } catch (error) {
          console.warn('aistudio check failed', error);
          setShowApiKeyDialog(true);
        }
      }
    };
    checkApiKey();
  }, []);

  const handleGenerate = useCallback(async (params: GenerateVideoParams) => {
    if (window.aistudio) {
      try {
        if (!(await window.aistudio.hasSelectedApiKey())) {
          setShowApiKeyDialog(true);
          return;
        }
      } catch (error) {
        setShowApiKeyDialog(true);
        return;
      }
    }

    setAppState(AppState.LOADING);
    setErrorMessage(null);
    setLastConfig(params);
    setInitialFormValues(null);

    try {
      const { objectUrl, blob, video } = await generateVideo(params);

      const newItem: VideoHistoryItem = {
        id: crypto.randomUUID(),
        url: objectUrl,
        timestamp: Date.now(),
        prompt: params.prompt,
        videoObject: video,
        blob: blob,
        config: params
      };

      setVideoUrl(objectUrl);
      setLastVideoBlob(blob);
      setLastVideoObject(video);
      setHistory(prev => {
        const updated = [newItem, ...prev];
        // Save to localStorage
        saveHistoryToStorage(updated);
        return updated;
      });
      setAppState(AppState.SUCCESS);

      // Auto-download video to downloads folder
      try {
        const filename = formatVideoFilename(params.prompt, newItem.id);
        await saveVideoToDownloads(blob, filename);
        console.log('Video auto-saved:', filename);
      } catch (err) {
        console.warn('Auto-save failed:', err);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      const isSafetyError = errorMessage.includes('safety filters') || errorMessage.includes('blocked');

      // Use warn for expected safety/filter errors, error for system failures
      if (isSafetyError) {
        console.warn('Video generation blocked:', errorMessage);
      } else {
        console.error('Video generation error:', error);
      }

      let userFriendlyMessage = errorMessage;
      const lowerMsg = userFriendlyMessage.toLowerCase();

      // Only prefix if it's not a self-explanatory message
      if (!lowerMsg.startsWith('video generation failed') && !lowerMsg.includes('service is temporarily busy')) {
        userFriendlyMessage = `Video generation failed: ${errorMessage}`;
      }

      let shouldOpenDialog = false;

      if (errorMessage.includes('Requested entity was not found.') || errorMessage.includes('API_KEY_INVALID') || errorMessage.includes('403')) {
        userFriendlyMessage = 'Your API key is invalid or lacks permissions. Please select a valid, billing-enabled API key.';
        shouldOpenDialog = true;
      }

      setErrorMessage(userFriendlyMessage);
      setAppState(AppState.ERROR);

      if (shouldOpenDialog) setShowApiKeyDialog(true);
    }
  }, []);

  const handleRetry = useCallback(() => {
    if (lastConfig) handleGenerate(lastConfig);
  }, [lastConfig, handleGenerate]);

  const handleApiKeyDialogContinue = async () => {
    setShowApiKeyDialog(false);
    if (window.aistudio) await window.aistudio.openSelectKey();
    if (appState === AppState.ERROR && lastConfig) handleRetry();
  };

  const handleBackToDashboard = () => {
    setAppState(AppState.IDLE);
    setVideoUrl(null);
    setErrorMessage(null);
    setView('dashboard');
  };

  const handleStartCreation = () => {
    setInitialFormValues(null);
    setAppState(AppState.IDLE);
    setVideoUrl(null);
    setErrorMessage(null);
    setView('create');
  };

  const handleDeleteHistoryItem = useCallback((id: string) => {
    setHistory(prev => {
      const updated = prev.filter(item => item.id !== id);
      // Save to localStorage after delete
      saveHistoryToStorage(updated);
      return updated;
    });
  }, []);

  const handleTryAgainFromError = useCallback(() => {
    if (lastConfig) {
      setInitialFormValues(lastConfig);
      setAppState(AppState.IDLE);
      setErrorMessage(null);
    } else {
      handleStartCreation();
    }
  }, [lastConfig]);

  const handleExtend = useCallback(async () => {
    if (lastConfig && lastVideoBlob && lastVideoObject) {
      try {
        const file = new File([lastVideoBlob], 'last_video.mp4', {
          type: lastVideoBlob.type,
        });
        const videoFile: VideoFile = { file, base64: '' };

        setInitialFormValues({
          ...lastConfig,
          mode: GenerationMode.EXTEND_VIDEO,
          prompt: '',
          inputVideo: videoFile,
          inputVideoObject: lastVideoObject,
          resolution: Resolution.P720,
          startFrame: null,
          endFrame: null,
          referenceImages: [],
          styleImage: null,
          isLooping: false,
        });

        setAppState(AppState.IDLE);
        setVideoUrl(null);
        setErrorMessage(null);
        setView('create'); // Ensure we are in create view
      } catch (error) {
        console.error('Extension prep failed', error);
      }
    }
  }, [lastConfig, lastVideoBlob, lastVideoObject]);

  // Handle extending from Dashboard history
  const handleExtendFromHistory = (item: VideoHistoryItem) => {
    try {
      const file = new File([item.blob], 'history_video.mp4', {
        type: item.blob.type,
      });
      const videoFile: VideoFile = { file, base64: '' };

      setInitialFormValues({
        ...item.config,
        mode: GenerationMode.EXTEND_VIDEO,
        prompt: '',
        inputVideo: videoFile,
        inputVideoObject: item.videoObject,
        resolution: Resolution.P720,
        // Reset other fields
        startFrame: null,
        endFrame: null,
        referenceImages: [],
        styleImage: null,
        isLooping: false,
      });
      setAppState(AppState.IDLE);
      setView('create');
    } catch (error) {
      console.error('Failed to load history item', error);
    }
  };

  const renderError = (message: string) => {
    const isSafety = message.toLowerCase().includes('safety filters') || message.toLowerCase().includes('blocked');
    return (
      <div className={`text-center ${isSafety ? 'bg-amber-900/20 border-amber-500/50' : 'bg-red-900/20 border-red-500'} border p-8 rounded-lg max-w-2xl mx-auto mt-8`}>
        <h2 className={`text-2xl font-bold ${isSafety ? 'text-amber-400' : 'text-red-400'} mb-4`}>
          {isSafety ? 'Generation Blocked' : 'Creation Failed'}
        </h2>
        <p className={`${isSafety ? 'text-amber-200' : 'text-red-300'} whitespace-pre-wrap`}>{message}</p>
        <button
          onClick={handleTryAgainFromError}
          className={`mt-6 px-6 py-2 ${isSafety ? 'bg-amber-600 hover:bg-amber-500' : 'bg-red-600 hover:bg-red-500'} rounded-lg transition-colors text-white font-medium`}>
          {isSafety ? 'Edit Prompt' : 'Try Again'}
        </button>
      </div>
    );
  };

  const canExtend = lastConfig?.resolution === Resolution.P720;

  return (
    <div className="h-screen bg-[#0a0a0a] text-gray-200 flex flex-col font-serif overflow-hidden">
      {showApiKeyDialog && <ApiKeyDialog onContinue={handleApiKeyDialogContinue} />}

      {/* Header */}
      <header className="py-4 px-8 bg-[#111] border-b border-gray-800 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3 cursor-pointer" onClick={handleBackToDashboard}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 flex items-center justify-center">
            <span className="text-black font-bold text-lg">✝</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-wide text-gray-100 font-serif">
            The Daily Bread
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {view === 'create' && (
            <button
              onClick={handleBackToDashboard}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <LayoutGridIcon className="w-4 h-4" />
              Dashboard
            </button>
          )}
        </div>
      </header>

      <main className="flex-grow flex flex-col w-full h-full overflow-y-auto">
        {view === 'dashboard' ? (
          <Dashboard
            history={history}
            onCreateNew={handleStartCreation}
            onExtend={handleExtendFromHistory}
            onDelete={handleDeleteHistoryItem}
          />
        ) : (
          /* Create / Result View */
          <div className="w-full max-w-5xl mx-auto p-4 sm:p-8 flex flex-col h-full">

            {appState === AppState.IDLE && (
              <div className="mb-6 flex items-center gap-2">
                <button onClick={handleBackToDashboard} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                  <ArrowLeftIcon className="w-5 h-5 text-gray-400" />
                </button>
                <h2 className="text-xl text-amber-500 font-medium">
                  {initialFormValues?.mode === GenerationMode.EXTEND_VIDEO ? 'Extend Video' : 'Create New Video'}
                </h2>
              </div>
            )}

            {appState === AppState.IDLE ? (
              <div className="pb-12">
                <PromptForm
                  onGenerate={handleGenerate}
                  initialValues={initialFormValues}
                />
              </div>
            ) : (
              <div className="flex-grow flex items-center justify-center min-h-[400px]">
                {appState === AppState.LOADING && <LoadingIndicator />}

                {appState === AppState.SUCCESS && videoUrl && (
                  <VideoResult
                    videoUrl={videoUrl}
                    onRetry={handleRetry}
                    onNewVideo={handleStartCreation}
                    onExtend={handleExtend}
                    canExtend={canExtend}
                    aspectRatio={lastConfig?.aspectRatio || AspectRatio.LANDSCAPE}
                  />
                )}

                {appState === AppState.ERROR && errorMessage && renderError(errorMessage)}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
