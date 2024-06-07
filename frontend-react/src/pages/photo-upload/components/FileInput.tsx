import { ChangeEvent, MutableRefObject } from "react";

interface FileInputsProps {
  galleryInputRef: MutableRefObject<HTMLInputElement | null>;
  videoInputRef: MutableRefObject<HTMLInputElement | null>;
  photoInputRef: MutableRefObject<HTMLInputElement | null>;
  handlePhotoCapture: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const FileInputs = ({
  galleryInputRef,
  photoInputRef,
  videoInputRef,
  handlePhotoCapture,
}: FileInputsProps) => {
  return (
    <>
      {" "}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*, video/*"
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
