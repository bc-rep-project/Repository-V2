const CODE_TYPES = new Set(['js', 'css', 'html', 'json', 'xml', 'text', 'md']);
const IMAGE_EXT = new Set(['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg']);
const VIDEO_EXT = new Set(['mp4', 'mov', 'avi', 'wmv', 'mkv']);
const AUDIO_EXT = new Set(['mp3', 'wav', 'ogg', 'flac']);
const DOC_EXT = new Set(['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx']);

export function getFileType(filename) {
  if (!filename || typeof filename !== 'string') return 'other';
  
  // Browser-compatible extension extraction
  const lastDotIndex = filename.lastIndexOf('.');
  const ext = lastDotIndex === -1 ? '' : filename.slice(lastDotIndex + 1).toLowerCase();
  
  if (CODE_TYPES.has(ext)) return ext;
  if (IMAGE_EXT.has(ext)) return 'image';
  if (VIDEO_EXT.has(ext)) return 'video';
  if (AUDIO_EXT.has(ext)) return 'audio';
  if (DOC_EXT.has(ext)) return 'document';
  
  return 'other';
}

export function isCodeFile(fileType) {
  return CODE_TYPES.has(fileType);
}

export function isMediaFile(fileType) {
  return ['image', 'video', 'audio'].includes(fileType);
} 