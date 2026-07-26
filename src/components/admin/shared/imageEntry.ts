// An image entry — either already uploaded (has url) or pending upload (has file)
export type ImageEntry = {
  id: string; // local key for React
  url: string; // preview URL (blob: or real /uploads/...)
  file?: File; // present only before upload
  uploading?: boolean;
  error?: string;
};
