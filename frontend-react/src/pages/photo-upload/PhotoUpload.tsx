import "./PhotoUpload.css";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { UploadType } from "./domain/UploadType";
import { Button } from "primereact/button";
import { FileInputs } from "./components/FileInput";
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
  const [backendUrl, setBackendUrl] = useState<string | null>(null);

  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  const { statusPending } = useUploadStatus(uploadStatus);
  const { t } = useTranslation();
  const toast = useToast();

  // Fetch the backend URL from the file

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
    const getBackendUrl = async () => {
      try {
        const response = await fetch("/backend-settings.json");
        const data = await response.json();
        const url = data.backendUrl;
        setBackendUrl(url.trim());
      } catch (error) {
        console.error("Error fetching backend URL:", error);
      }
    };
    const getDefaultPhoto = async () => {
      const response = await fetch("/logo192.png");
      setFileUrl(URL.createObjectURL(await response.blob()));
    };
    getDefaultPhoto();
    getBackendUrl();
  }, []);

  const handlePhotoCapture = (event: ChangeEvent<HTMLInputElement>) => {
    const newFile = event.target.files ? event.target.files[0] : null;
    if (newFile) {
      setUploadType(newFile.type.split("/")[0] as UploadType);
      setFileUrl(URL.createObjectURL(newFile));
      setFile(newFile);
    }
  };

  const uploadPhotoToDrive = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const request = fetch(`${backendUrl}/upload`, {
        method: "POST",
        body: formData,
        headers: {
          "bypass-tunnel-reminder": "hope-you-enjoy-guys",
        },
      });
      setUploadStatus(UploadStatus.Pending);
      await request;
      setUploadStatus(UploadStatus.Sent);
    } catch (error) {
      setUploadStatus(UploadStatus.Failed);
      toast.error(getSubmitText(MediaSubmitI18NKeys.ErrorToast));
    } finally {
      setUploadStatus(UploadStatus.Idle);
      uploadType === UploadType.Photo
        ? toast.success(getSubmitText(MediaSubmitI18NKeys.SuccessToastPhoto))
        : toast.success(getSubmitText(MediaSubmitI18NKeys.SuccessToastVideo));

      setFile(null);
      setFileUrl("");
    }
  };

  return (
    <div className="flex p-1 h-full flex-column gap-1 align-items-center justify-content-center">
      <div className="flex text-center font-bold text-3xl">
        {getPageText(PhotoUploadI18NKeys.Header)}
      </div>
      <div className="flex text-justify mx-3 text-base">
        {getPageText(PhotoUploadI18NKeys.Paragraph)}
      </div>
      <div className="flex flex-column align-items-center justify-content-center">
        {file && (
          <>
            {uploadType === UploadType.Video && (
              <video controls className="max-w-20rem my-4">
                <source src={fileUrl} />
              </video>
            )}
            {uploadType === UploadType.Photo && (
              <img
                className="max-w-20rem max-h-17rem my-4"
                src={fileUrl}
                alt="Captured"
              />
            )}
            <Button
              icon="pi pi-upload"
              label={
                uploadType === UploadType.Photo
                  ? getSubmitText(MediaSubmitI18NKeys.SubmitButtonPhoto)
                  : getSubmitText(MediaSubmitI18NKeys.SubmitButtonVideo)
              }
              className="upload-button"
              onClick={uploadPhotoToDrive}
            />
          </>
        )}
      </div>
      <div className="flex flex-grow-1"></div>
      {statusPending() ? (
        <div className="mb-4">
          <LoadingSpinner
            text={getPageText(PhotoUploadI18NKeys.LoadingSpinner)}
          />
        </div>
      ) : (
        <div className="flex flex-column align-item-center justify-content-center">
          <div className="flex w-full align-item-center justify-content-around">
            <Button
              icon="pi pi-video"
              size="large"
              label={getSubmitText(MediaSubmitI18NKeys.VideoButton)}
              className="capture-button w-full"
              onClick={() => videoInputRef.current?.click()}
            />
            <Button
              icon="pi pi-camera"
              label={getSubmitText(MediaSubmitI18NKeys.PhotoButton)}
              size="large"
              className="capture-button w-full"
              onClick={() => photoInputRef.current?.click()}
            />
          </div>
          <Button
            icon="pi pi-images"
            label={getSubmitText(MediaSubmitI18NKeys.FromGalleryButton)}
            size="large"
            className="flex capture-button flex-grow-1"
            onClick={() => galleryInputRef.current?.click()}
          />
          <FileInputs
            galleryInputRef={galleryInputRef}
            videoInputRef={videoInputRef}
            photoInputRef={photoInputRef}
            handlePhotoCapture={handlePhotoCapture}
          />
        </div>
      )}
    </div>
  );
};
