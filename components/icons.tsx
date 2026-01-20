
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowLeft,
  Baseline,
  ChevronDown,
  Download,
  Film,
  FileImage,
  FolderOpen,
  Image,
  KeyRound,
  Layers,
  LayoutGrid,
  Package,
  Plus,
  RefreshCw,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Tv,
  X,
} from 'lucide-react';

const defaultProps = {
  strokeWidth: 1.5,
};

export const KeyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <KeyRound {...defaultProps} {...props} />
);

export const ArrowPathIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => <RefreshCw {...defaultProps} {...props} />;

export const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Sparkles {...defaultProps} {...props} />
);

export const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Plus {...defaultProps} {...props} />
);

export const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => <ChevronDown {...defaultProps} {...props} />;

export const SlidersHorizontalIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => <SlidersHorizontal {...defaultProps} {...props} />;

export const ArrowRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => <ArrowRight {...defaultProps} {...props} />;

export const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => <ArrowLeft {...defaultProps} {...props} />;

export const RectangleStackIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => <Layers {...defaultProps} {...props} />;

export const XMarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <X {...defaultProps} {...props} />
);

export const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Trash2 {...defaultProps} {...props} />
);

export const PackageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Package {...defaultProps} {...props} />
);

export const TextModeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Baseline {...defaultProps} {...props} />
);

export const FramesModeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => <Image {...defaultProps} {...props} />

export const ReferencesModeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => <Film {...defaultProps} {...props} />;

export const TvIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Tv {...defaultProps} {...props} />
);

export const FilmIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Film {...defaultProps} {...props} />
);

export const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Download {...defaultProps} {...props} />
);

export const FileImageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <FileImage {...defaultProps} {...props} />
);

export const LayoutGridIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <LayoutGrid {...defaultProps} {...props} />
);

// This icon had a different stroke width in the original file, so we preserve it.
export const CurvedArrowDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => <ArrowDown {...props} strokeWidth={3} />;

export const FolderOpenIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <FolderOpen {...defaultProps} {...props} />
);
