import { ChangeEvent, MutableRefObject } from "react";

interface FileInputsProps {
  galleryInputRef: MutableRefObject<HTMLInputElement | null>;
  videoInputRef: MutableRefObject<HTMLInputElement | null>;
  photoInputRef: MutableRefObject<HTMLInputElement | null>;
  handleMediaFileCapture: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const FileInputs = ({
  galleryInputRef,
  photoInputRef,
  videoInputRef,
  handleMediaFileCapture: handlePhotoCapture,
}: FileInputsProps) => {
  return (
    <>
      <input
        ref={galleryInputRef}
        type="file"
        accept="video/*, image/*"
        onChange={handlePhotoCapture}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        capture="environment"
        onChange={handlePhotoCapture}
      />
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handlePhotoCapture}
      />
    </>
  );
};
