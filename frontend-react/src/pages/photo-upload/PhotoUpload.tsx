import "./PhotoUpload.css";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { UploadType } from "./domain/UploadType";
import { Button } from "primereact/button";
import { FileInputs } from "./components/FileInputs";
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
import { useOutletContext } from "react-router-dom";
import { MainLayoutOutletContextType } from "../../layout/main-layout/MainLayout";
import { PercentageProgress } from "../../shared/components/percentatage-progress/PercentageProgress";
import { useIndexedDBMediaFile } from "./hooks/useIndexedDBMediaFile";

const CHUNK_SIZE = 1024 * 1024; // 1MB

export const PhotoUpload = () => {
  const [file, setFile] = useState<File | null>();
  const [uploadType, setUploadType] = useState<UploadType | null>(
    UploadType.Photo
  );
  const [uploadingPhoto, setUploadingPhoto] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [compressingFile, setIfCompressingFile] = useState<boolean>(false);
  const [videoCompressionProgress, setVideoCompressionProgress] =
    useState<number>(0);

  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const uploadedChunksRef = useRef<number>(0);

  const { uploadMediaFileToDrive, downloadMediaFile } = useMediaFileUpload();
  const { compressPhoto, compressVideo } = useMediaFileCompress(
    setVideoCompressionProgress
  );
  const { deleteMediaFileBinaryData, getMediaFileBinaryData } =
    useIndexedDBMediaFile();
  const { t } = useTranslation();
  const toast = useToast();
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
    const load = async () => {
      const { data: idbCacheData, type: idbCacheType } =
        await getMediaFileBinaryData();

      if (!idbCacheData) {
        return;
      }

      let newFile: File;

      switch (idbCacheType) {
        case UploadType.Photo:
          newFile = new File([idbCacheData], v4(), {
            type: "photo/jpeg",
          });

          setUploadType(UploadType.Photo);
          setFile(newFile);
          setFileUrl(URL.createObjectURL(newFile));
          break;
        case UploadType.Video:
          newFile = new File([idbCacheData], v4(), {
            type: "photo/mp4",
          });

          setUploadType(UploadType.Video);
          setFile(newFile);
          setFileUrl(URL.createObjectURL(newFile));
          break;
      }
    };

    load();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (sendFile) {
      uploadMediaFile().then(() => setIfSendFile(false));
    }
    //eslint-disable-next-line
  }, [sendFile]);

  const handleMediaFileCapture = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const newFile = event.target.files ? event.target.files[0] : null;
    if (newFile) {
      const fileType = newFile.type.split("/")[0] as UploadType;
      const fileExtensionType = newFile.type.split("/")[1] as UploadType;

      setIfCompressingFile(true);
      setFileUrl("");
      setFile(null);
      setUploadType(fileType);

      const { fileUrl, compressedFile } =
        fileType === UploadType.Photo
          ? await compressPhoto(newFile, fileExtensionType)
          : await compressVideo(newFile, fileExtensionType);

      setFileUrl(fileUrl);
      setFile(compressedFile);
      setIfCompressingFile(false);
    }
  };

  const handleMediaFileDelete = async () => {
    setIfCompressingFile(false);
    setFileUrl("");
    setFile(null);
    await deleteMediaFileBinaryData();

    toast.info(
      uploadType === UploadType.Photo
        ? getSubmitText(MediaSubmitI18NKeys.InfoToastPhotoDeleted)
        : getSubmitText(MediaSubmitI18NKeys.InfoToastVideoDeleted)
    );
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
            Math.floor((++uploadedChunksRef.current / chunks.length) * 100)
          );
        },
        () => {
          uploadedChunksRef.current = 0;
          uploadType === UploadType.Photo
            ? toast.success(
                getSubmitText(MediaSubmitI18NKeys.SuccessToastPhoto)
              )
            : toast.success(
                getSubmitText(MediaSubmitI18NKeys.SuccessToastVideo)
              );

          setUploadingPhoto(false);
          setUploadProgress(0);
          setFile(null);
          setFileUrl("");
        },
        () => {
          toast.error(getSubmitText(MediaSubmitI18NKeys.ErrorToast));
        }
      );

      await deleteMediaFileBinaryData();
    } catch (error) {}
  };

  return (
    <>
      <div className="flex flex-column align-items-center justify-content-center">
        <div
          className={`preview border-round-xs ${!file && "preview-min-size"}`}
        >
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
                  src={fileUrl}
                  alt="Captured"
                  className="max-w-20rem max-h-20rem border-round-xs"
                />
              )}
            </>
          )}
        </div>
      </div>
      <div className="flex flex-grow-1"></div>
      {uploadingPhoto ? (
        <div className="loading-spinner">
          {uploadType === UploadType.Video && (
            <PercentageProgress percentage={uploadProgress} />
          )}
          <LoadingSpinner
            text={
              uploadType === UploadType.Photo
                ? getSubmitText(MediaSubmitI18NKeys.UploadProgressPhoto)
                : getSubmitText(MediaSubmitI18NKeys.UploadProgressVideo)
            }
            textClassNames="font-bold"
          />
        </div>
      ) : compressingFile ? (
        <div className="loading-spinner">
          {uploadType === UploadType.Video && (
            <PercentageProgress percentage={videoCompressionProgress} />
          )}
          <LoadingSpinner
            text={
              uploadType === UploadType.Photo
                ? getSubmitText(MediaSubmitI18NKeys.CompressionProgressPhoto)
                : getSubmitText(MediaSubmitI18NKeys.CompressionProgressVideo)
            }
          />
          <div className="flex w-full align-items-center justify-content-center font-bold text-justify mt-1 text-lg">
            {getSubmitText(MediaSubmitI18NKeys.InterruptCompressionText)}
          </div>
        </div>
      ) : (
        !uploadingPhoto && (
          <div className="flex flex-column align-item-center justify-content-center mb-8">
            {!!file ? (
              <>
                <div className="flex w-full align-item-center justify-content-between">
                  <Button
                    icon={"pi pi-cloud-upload"}
                    size="large"
                    outlined
                    label={
                      uploadType === UploadType.Photo
                        ? getSubmitText(MediaSubmitI18NKeys.SubmitButtonPhoto)
                        : getSubmitText(MediaSubmitI18NKeys.SubmitButtonVideo)
                    }
                    className="capture-button w-full"
                    onClick={uploadMediaFile}
                  />
                  <Button
                    icon={"pi pi-trash"}
                    size="large"
                    outlined
                    label={
                      uploadType === UploadType.Photo
                        ? getSubmitText(MediaSubmitI18NKeys.RemovePhotoButton)
                        : getSubmitText(MediaSubmitI18NKeys.RemoveVideoButton)
                    }
                    className="capture-button w-full"
                    onClick={handleMediaFileDelete}
                  />
                </div>
                <Button
                  size="large"
                  outlined
                  label={getSubmitText(MediaSubmitI18NKeys.DownloadFileButton)}
                  className="flex capture-button flex-grow-1 mb-3"
                  onClick={() => {
                    downloadMediaFile(
                      fileUrl,
                      `${file.name}.${file.type.split("/")[1]}`
                    );
                    toast.info(
                      getSubmitText(MediaSubmitI18NKeys.InfoToastDownloadFile)
                    );
                  }}
                />
              </>
            ) : (
              <>
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
                    setIfCompressingFile(true);
                    handleMediaFileCapture(e);
                  }}
                />
              </>
            )}
          </div>
        )
      )}
    </>
  );
};
