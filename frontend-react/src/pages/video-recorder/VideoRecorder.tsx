import { Button } from "primereact/button";
import React, { useState, useRef } from "react";
import "./VideoRecorder.css";
import { useMediaRecorder } from "./hooks/useMediaRecorder";
import { useTranslation } from "react-i18next";
import { createNestedKey } from "../../utils/stringUtils";
import { VideoRecorderI18NKeys } from "../../utils/translation/domain/video-recorder/VideoRecorderI18N";
import { TranslationResourceKeys } from "../../utils/translation/domain/TranslationResource";
import { useNavigate, useOutletContext } from "react-router-dom";
import { MainLayoutOutletContextType } from "../../layout/main-layout/MainLayout";

export enum RecordingState {
  Idle,
  Recording,
  Recorded,
}

export const VideoRecorder: React.FC = () => {
  const [recording, setRecording] = useState<RecordingState>(
    RecordingState.Idle
  );
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [switchingCamera, setIfSwitchingCamera] = useState<boolean>(false);
  const { setFileUrl, setIfSendFile } =
    useOutletContext<MainLayoutOutletContextType>();
  const navigate = useNavigate();

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const {
    startRecording,
    stopRecording,
    repeatRecording,
    switchCamera,
    getRecordingTime,
  } = useMediaRecorder(videoRef, setVideoUrl, setRecording, setRecordingTime);

  const { t } = useTranslation();

  const getPageText = (key: VideoRecorderI18NKeys) =>
    t(createNestedKey(TranslationResourceKeys.VideoRecorder, key));

  const uploadMediaFile = async () => {
    console.log(videoUrl);

    if (!videoUrl) return;

    setFileUrl(videoUrl);
    setIfSendFile(true);
    navigate("/");
  };

  return (
    <>
      <div
        className={`preview border-round-xs ${!videoUrl && "preview-min-size"}`}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="border-round-xs"
          style={{ display: !videoUrl ? "inherit" : "none" }}
        ></video>
        {videoUrl && (
          <video src={videoUrl} controls className="border-round-xs"></video>
        )}
      </div>
      {recordingTime > 0 && (
        <div className="flex text-justify mx-3 text-7xl">
          {getRecordingTime(recordingTime)}
        </div>
      )}
      <div className="flex flex-column align-items-center justify-content-center">
        <div className="flex w-full align-item-center justify-content-around">
          {recording === RecordingState.Recording ? (
            <Button
              outlined
              className="capture-button w-full"
              onClick={stopRecording}
              label={getPageText(VideoRecorderI18NKeys.StopRecordingButton)}
            ></Button>
          ) : recording === RecordingState.Idle ? (
            <Button
              outlined
              className="capture-button w-full"
              onClick={startRecording}
              label={getPageText(VideoRecorderI18NKeys.StartRecordingButton)}
            ></Button>
          ) : (
            recording === RecordingState.Recorded && (
              <Button
                outlined
                className="capture-button w-full"
                onClick={repeatRecording}
                label={getPageText(VideoRecorderI18NKeys.RepeatRecordingButton)}
              ></Button>
            )
          )}
          {videoUrl ? (
            <Button
              outlined
              className="capture-button w-full"
              onClick={uploadMediaFile}
              label={getPageText(VideoRecorderI18NKeys.AddNewVideo)}
            />
          ) : (
            recording === RecordingState.Idle && (
              <Button
                outlined
                className="capture-button w-full"
                disabled={switchingCamera}
                onClick={() => {
                  setIfSwitchingCamera(true);
                  switchCamera();
                  setIfSwitchingCamera(false);
                }}
                label={getPageText(VideoRecorderI18NKeys.SwitchCamera)}
              ></Button>
            )
          )}
        </div>
      </div>
    </>
  );
};
