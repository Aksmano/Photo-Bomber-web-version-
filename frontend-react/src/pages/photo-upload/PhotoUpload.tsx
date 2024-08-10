import "./PhotoUpload.css";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { UploadType } from "./domain/UploadType";
import { Button } from "primereact/button";
import { FileInputs } from "./components/FileInputs";
import { UploadStatus } from "./domain/UploadStatus";
import { useUploadStatus } from "./hooks/useUploadStatus";
import { LoadingSpinner } from "../../shared/components/loading-spinner/LoadingSpinner";
import { useToast } from "../../shared/components/toast/hooks/useToast";
import { useTranslation } from "react-i18next";
import { createNestedKey } from "../../utils/stringUtils";
import { TranslationResourceKeys } from "../../utils/translation/domain/TranslationResource";
import { PhotoUploadI18NKeys } from "../../utils/translation/domain/photo-upload/PhotoUploadI18N";
import { MediaSubmitI18NKeys } from "../../utils/translation/domain/photo-upload/subkeys/MediaSubmitI18N";

export const PhotoUpload = () => {
  const [file, setFile] = useState<File | null>();
  const [fileUrl, setFileUrl] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>(
    UploadStatus.Idle
  );
  const [uploadType, setUploadType] = useState<UploadType | null>(
    UploadType.Photo
  );

  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  const { statusPending } = useUploadStatus(uploadStatus);
  const { t } = useTranslation();
  const toast = useToast();

  const getPageText = (key: PhotoUploadI18NKeys) =>
    t(createNestedKey(TranslationResourceKeys.PhotoUpload, key));
  const getSubmitText = (key: MediaSubmitI18NKeys) =>
    t(
      createNestedKey(
        TranslationResourceKeys.PhotoUpload,
        PhotoUploadI18NKeys.MediaSubmit,
        key
      )
    );

  useEffect(() => {
    const getDefaultPhoto = async () => {
      const response = await fetch("/logo192.png");
      setFileUrl(URL.createObjectURL(await response.blob()));
    };
    getDefaultPhoto();
  }, []);

  const handleMediaFileCapture = (event: ChangeEvent<HTMLInputElement>) => {
    const newFile = event.target.files ? event.target.files[0] : null;
    if (newFile) {
      setUploadType(newFile.type.split("/")[0] as UploadType);
      setFileUrl(URL.createObjectURL(newFile));
      setFile(newFile);
    }
  };

  const uploadMediaFileToDrive = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const request = fetch(`api/upload`, {
        method: "POST",
        body: formData,
        headers: {
          "bypass-tunnel-reminder": "hope-you-enjoy-guys",
        },
      });
      setUploadStatus(UploadStatus.Pending);
      const response = await request;
      if (!response.ok) {
        throw new Error(await response.text());
      }

      setUploadStatus(UploadStatus.Sent);
      uploadType === UploadType.Photo
        ? toast.success(getSubmitText(MediaSubmitI18NKeys.SuccessToastPhoto))
        : toast.success(getSubmitText(MediaSubmitI18NKeys.SuccessToastVideo));

      setUploadStatus(UploadStatus.Idle);
      setFile(null);
      setFileUrl("");
    } catch (error) {
      setUploadStatus(UploadStatus.Failed);
      toast.error(getSubmitText(MediaSubmitI18NKeys.ErrorToast));
    }
  };

  return (
    <div className="flex p-1 h-full flex-column gap-1 align-items-center justify-content-center">
      <div
        style={{ fontFamily: "A day without sun" }}
        className="flex text-center mt-7 text-8xl"
      >
        {getPageText(PhotoUploadI18NKeys.Header)}
      </div>
      <div className="flex text-justify mx-3 text-4xl">
        {getPageText(PhotoUploadI18NKeys.Paragraph)}
      </div>
      <div className="flex flex-column align-items-center justify-content-center">
        <div
          className={`preview border-round-xs ${!file && "preview-min-size"}`}
        >
          {/* <div className="inner-preview border-round-xs"> */}
          {file && (
            <>
              {uploadType === UploadType.Video && (
                <video
                  controls
                  className="max-w-20rem max-h-20rem border-round-xs"
                >
                  <source src={fileUrl} />
                </video>
              )}
              {uploadType === UploadType.Photo && (
                <img
                  className="max-w-20rem max-h-20rem border-round-xs"
                  src={fileUrl}
                  alt="Captured"
                />
              )}
            </>
          )}
          {/* </div> */}
        </div>
        {!!file && (
          <Button
            label={
              uploadType === UploadType.Photo
                ? getSubmitText(MediaSubmitI18NKeys.SubmitButtonPhoto)
                : getSubmitText(MediaSubmitI18NKeys.SubmitButtonVideo)
            }
            disabled={statusPending()}
            className="upload-button"
            onClick={uploadMediaFileToDrive}
          />
        )}
      </div>
      <div className="flex flex-grow-1"></div>
      {statusPending() ? (
        <div className="loading-spinner">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="flex flex-column align-item-center justify-content-center mb-8">
          <div className="flex w-full align-item-center justify-content-around">
            <Button
              icon="pi pi-video"
              size="large"
              label={getSubmitText(MediaSubmitI18NKeys.VideoButton)}
              className="capture-button w-full"
              onClick={() => videoInputRef.current?.click()}
              outlined
            />
            <Button
              icon="pi pi-camera"
              label={getSubmitText(MediaSubmitI18NKeys.PhotoButton)}
              size="large"
              className="capture-button w-full"
              onClick={() => photoInputRef.current?.click()}
              outlined
            />
          </div>
          <Button
            // icon="pi pi-images"
            label={getSubmitText(MediaSubmitI18NKeys.FromGalleryButton)}
            size="large"
            className="flex capture-button flex-grow-1 mb-3"
            onClick={() => galleryInputRef.current?.click()}
            outlined
          />
          <FileInputs
            galleryInputRef={galleryInputRef}
            videoInputRef={videoInputRef}
            photoInputRef={photoInputRef}
            handleMediaFileCapture={handleMediaFileCapture}
          />
        </div>
      )}
    </div>
  );
};
