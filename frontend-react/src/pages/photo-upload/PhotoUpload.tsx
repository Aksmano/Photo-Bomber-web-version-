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
import { useMediaFileUpload } from "./hooks/useMediaFileUpload";
import { v4 } from "uuid";
import { useMediaFileCompress } from "./hooks/useMediaFileCompress";
import { useNavigate, useOutletContext } from "react-router-dom";
import { RecordingState } from "../video-recorder/VideoRecorder";
import { useMediaRecorder } from "../video-recorder/hooks/useMediaRecorder";
import { MainLayoutOutletContextType } from "../../layout/main-layout/MainLayout";

const CHUNK_SIZE = 1024 * 1024; // 1GB

export const PhotoUpload = () => {
  const [file, setFile] = useState<File | null>();
  // const [fileUrl, setFileUrl] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>(
    UploadStatus.Idle
  );
  const [uploadType, setUploadType] = useState<UploadType | null>(
    UploadType.Photo
  );
  const [uploadingPhoto, setUploadingPhoto] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [gettingAddedPhoto, setIfGettingAddedPhoto] = useState<boolean>(false);

  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const uploadedChunksRef = useRef<number>(0);

  const [recording, setRecording] = useState<RecordingState>(
    RecordingState.Idle
  );
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [recordingTime, setRecordingTime] = useState<number>(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useMediaRecorder(videoRef, setVideoUrl, setRecording, setRecordingTime);

  const { statusPending } = useUploadStatus(uploadStatus);
  const { uploadMediaFileToDrive } = useMediaFileUpload();
  const { compressPhoto } = useMediaFileCompress();
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();
  const { fileUrl, setFileUrl, sendFile, setIfSendFile } =
    useOutletContext<MainLayoutOutletContextType>();

  const getSubmitText = (key: MediaSubmitI18NKeys) =>
    t(
      createNestedKey(
        TranslationResourceKeys.PhotoUpload,
        PhotoUploadI18NKeys.MediaSubmit,
        key
      )
    );

  useEffect(() => {
    if (sendFile) {
      uploadMediaFile().then(() => setIfSendFile(false));
    }
  }, [sendFile]);

  const handleMediaFileCapture = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const newFile = event.target.files ? event.target.files[0] : null;
    if (newFile) {
      setIfGettingAddedPhoto(true);
      setFileUrl("");
      setFile(null);
      const type = newFile.type.split("/")[0] as UploadType;
      const { fileUrl, compressedFile } =
        type === UploadType.Photo
          ? await compressPhoto(newFile, type)
          : // : await compressVideo(newFile, type); // Operation to hard to handle for phone
            { fileUrl: URL.createObjectURL(newFile), compressedFile: newFile };

      setUploadType(type);
      setFileUrl(fileUrl);
      setFile(compressedFile);
      setIfGettingAddedPhoto(false);
    }
  };

  const uploadMediaFile = async () => {
    if (!fileUrl) return;

    const newFile = await fetch(fileUrl).then(async (res) => {
      const blob = await res.blob();
      return new File([blob], v4(), { type: blob.type });
    });
    try {
      setUploadingPhoto(true);

      await uploadMediaFileToDrive(
        newFile,
        CHUNK_SIZE,
        (chunks: Blob[]) => {
          setUploadProgress(
            Math.round((++uploadedChunksRef.current / chunks.length) * 100)
          );
        },
        () => {
          setUploadStatus(UploadStatus.Sent);
          uploadedChunksRef.current = 0;
          uploadType === UploadType.Photo
            ? toast.success(
                getSubmitText(MediaSubmitI18NKeys.SuccessToastPhoto)
              )
            : toast.success(
                getSubmitText(MediaSubmitI18NKeys.SuccessToastVideo)
              );

          setUploadStatus(UploadStatus.Idle);
          setUploadingPhoto(false);
          setUploadProgress(0);
          setFile(null);
          setFileUrl("");
        },
        () => {
          setUploadStatus(UploadStatus.Failed);
          toast.error(getSubmitText(MediaSubmitI18NKeys.ErrorToast));
        }
      );
    } catch (error) {}
  };

  return (
    <>
      <div className="flex flex-column align-items-center justify-content-center">
        {!gettingAddedPhoto && (
          <div
            className={`preview border-round-xs ${!file && "preview-min-size"}`}
          >
            {/* <div className="inner-preview border-round-xs"> */}
            {file ? (
              <>
                {uploadType === UploadType.Video && (
                  <video controls>
                    <source src={fileUrl} />
                  </video>
                )}
                {uploadType === UploadType.Photo && (
                  <img
                    src={fileUrl}
                    alt="Captured"
                    className="preview-max-size-img"
                  />
                )}
              </>
            ) : (
              <video ref={videoRef} autoPlay muted playsInline></video>
            )}
          </div>
        )}
        {!!file && (
          <Button
            label={
              uploadType === UploadType.Photo
                ? getSubmitText(MediaSubmitI18NKeys.SubmitButtonPhoto)
                : getSubmitText(MediaSubmitI18NKeys.SubmitButtonVideo)
            }
            disabled={statusPending()}
            className="upload-button"
            onClick={uploadMediaFile}
          />
        )}
      </div>

      <div className="flex flex-grow-1"></div>
      {uploadingPhoto ? (
        <div className="loading-spinner">
          <LoadingSpinner text={`${uploadProgress}%`} />
        </div>
      ) : gettingAddedPhoto ? (
        <div className="loading-spinner">
          <LoadingSpinner text={"Ładowanie zdjęcia"} />
        </div>
      ) : (
        <div className="flex flex-column align-item-center justify-content-center mb-8">
          <div className="flex w-full align-item-center justify-content-around">
            <Button
              icon="pi pi-video"
              size="large"
              label={getSubmitText(MediaSubmitI18NKeys.VideoButton)}
              className="capture-button"
              onClick={() => {
                setFileUrl("");
                navigate("video");
              }}
              outlined
            />
            <Button
              icon="pi pi-camera"
              label={getSubmitText(MediaSubmitI18NKeys.PhotoButton)}
              size="large"
              className="capture-button"
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
            handleMediaFileCapture={(e) => {
              setIfGettingAddedPhoto(true);
              handleMediaFileCapture(e);
            }}
          />
        </div>
      )}
    </>
  );
};
