
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { VideoHistoryItem } from '../types';
import { PlusIcon, FilmIcon, SparklesIcon, DownloadIcon, FileImageIcon, TrashIcon, FolderOpenIcon } from './icons';
import { openDownloadsFolder } from '../storage';
// @ts-ignore
import gifshot from 'gifshot';

interface DashboardProps {
  history: VideoHistoryItem[];
  onCreateNew: () => void;
  onExtend: (item: VideoHistoryItem) => void;
  onDelete: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ history, onCreateNew, onExtend, onDelete }) => {
  const [convertingId, setConvertingId] = useState<string | null>(null);

  const handleDownloadGif = (videoUrl: string, id: string) => {
    if (convertingId) return;
    setConvertingId(id);

    // Create a GIF from the video
    // Using a moderate frame count for dashboard quick-export
    gifshot.createGIF({
      video: [videoUrl],
      numFrames: 40,
      interval: 0.1,
      gifWidth: 400,
      gifHeight: 225, // Approx 16:9
      sampleInterval: 10,
    }, (obj: any) => {
      if (!obj.error) {
        const link = document.createElement('a');
        link.href = obj.image;
        link.download = `daily-bread-${id}.gif`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error('GIF generation failed:', obj.error);
        alert('Failed to generate GIF. The video format might not be supported.');
      }
      setConvertingId(null);
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-8">
      <div className="flex items-end justify-between mb-12 border-b border-gray-800 pb-6">
        <div>
          <h2 className="text-3xl font-serif text-white mb-2">My Library</h2>
          <p className="text-gray-400">Manage your generated content and create new videos.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={openDownloadsFolder}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2.5 rounded-lg transition-all font-medium text-sm"
            title="Open downloads folder"
          >
            <FolderOpenIcon className="w-4 h-4" />
            Open Folder
          </button>
          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-lg transition-all shadow-lg shadow-amber-900/20 font-medium"
          >
            <PlusIcon className="w-5 h-5" />
            Create New Video
          </button>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-[#111] rounded-2xl border border-dashed border-gray-800">
          <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-6 text-gray-600">
            <FilmIcon className="w-8 h-8" />
          </div>
          <h3 className="text-xl text-gray-300 font-medium mb-2">No videos yet</h3>
          <p className="text-gray-500 mb-8 max-w-md text-center">Start sharing the Gospel by creating your first AI-generated video using Veo.</p>
          <button
            onClick={onCreateNew}
            className="text-amber-500 hover:text-amber-400 font-medium flex items-center gap-2"
          >
            Start Creating <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {history.map((item) => (
            <div key={item.id} className="bg-[#151515] border border-gray-800 rounded-xl overflow-hidden group hover:border-gray-600 transition-all shadow-xl relative">

              {/* Delete Button (Overlay) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Are you sure you want to delete this video?')) {
                    onDelete(item.id);
                  }
                }}
                className="absolute top-2 right-2 z-10 p-2 bg-black/60 text-gray-300 hover:text-red-400 hover:bg-black/80 rounded-full transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="Delete Video"
              >
                <TrashIcon className="w-4 h-4" />
              </button>

              <div className="aspect-video bg-black relative">
                <video
                  src={item.url}
                  className="w-full h-full object-cover"
                  controls
                  preload="metadata"
                />
              </div>
              <div className="p-5">
                <div className="mb-4">
                  <p className="text-sm text-gray-300 line-clamp-2 font-serif italic">"{item.prompt}"</p>
                  <p className="text-xs text-gray-600 mt-2">
                    {new Date(item.timestamp).toLocaleDateString()} &bull; 720p
                  </p>
                </div>
                {/* Action Buttons Grid */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-800">
                  <button
                    onClick={() => onExtend(item)}
                    className="flex items-center justify-center gap-1.5 py-2 px-2 bg-gray-800 hover:bg-gray-700 text-[10px] text-gray-300 rounded transition-colors"
                    title="Extend this video"
                  >
                    <SparklesIcon className="w-3 h-3" /> Extend
                  </button>
                  <a
                    href={item.url}
                    download={`daily-bread-${item.id}.mp4`}
                    className="flex items-center justify-center gap-1.5 py-2 px-2 bg-gray-800 hover:bg-gray-700 text-[10px] text-gray-300 rounded transition-colors"
                    title="Download MP4"
                  >
                    <DownloadIcon className="w-3 h-3" /> MP4
                  </a>
                  <button
                    onClick={() => handleDownloadGif(item.url, item.id)}
                    disabled={convertingId === item.id}
                    className="flex items-center justify-center gap-1.5 py-2 px-2 bg-gray-800 hover:bg-gray-700 text-[10px] text-gray-300 rounded transition-colors disabled:opacity-50 disabled:cursor-wait"
                    title="Download GIF"
                  >
                    {convertingId === item.id ? (
                      <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FileImageIcon className="w-3 h-3" />
                    )}
                    GIF
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
