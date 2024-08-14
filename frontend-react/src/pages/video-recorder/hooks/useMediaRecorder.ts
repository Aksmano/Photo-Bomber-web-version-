import { MutableRefObject, useEffect, useRef, useState } from "react";
import { RecordingState } from "../VideoRecorder";

export const useMediaRecorder = (
  videoRef: MutableRefObject<HTMLVideoElement | null>,
  setVideoUrl: React.Dispatch<React.SetStateAction<string>>,
  setRecording: React.Dispatch<React.SetStateAction<RecordingState>>,
  setRecordingTime: React.Dispatch<React.SetStateAction<number>>
) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  // const [camera, setCamera] = useState<"user" | "environment">("environment"); // 'user' for front, 'environment' for rear
  const [camera, setCamera] = useState<number>(0); // 'user' for front, 'environment' for rear

  const recordingTimeIntervalRef = useRef<NodeJS.Timer>();
  const videoDeviceIdsRef = useRef<string[]>([]);

  useEffect(() => {
    const initStream = async () => {
      try {
        console.log("aaa");

        if (videoDeviceIdsRef.current.length === 0) {
          const videoDevicesIdsLocal = (
            await navigator.mediaDevices.enumerateDevices()
          )
            .filter((d) => d.kind.includes("videoinput"))
            .map((d) => d.deviceId);

          videoDeviceIdsRef.current = videoDevicesIdsLocal;
        }

        if (!!stream) {
          while (!stream.getTracks().every((t) => t.readyState === "ended")) {
            stream.getTracks().forEach((track) => {
              console.log(track, track.readyState);
              track.stop();
            });
          }
        }
        if (!!videoRef.current) {
          videoRef.current.srcObject = null;
        }
        console.log(stream?.getTracks());

        // const videoConstraints: MediaTrackConstraints = {};
        console.log(videoDeviceIdsRef.current);

        const newStream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { exact: videoDeviceIdsRef.current[camera] },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: {
            channelCount: 2,
            autoGainControl: false,
            echoCancellation: false,
            noiseSuppression: false,
          },
        });

        // setCamera((prevValue) => (prevValue + 1) % videoDevicesIdsLocal.length);

        console.log(newStream.getVideoTracks()[0]);
        setStream(newStream);
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }
      } catch (err) {
        console.error("Error accessing media devices.", err);
      }
    };

    initStream();

    console.log(camera);

    return () => {
      console.log(stream);

      if (!!stream) {
        stream.getTracks().forEach((track) => {
          console.log(track);

          track.stop();
        });
      }
    };
    //eslint-disable-next-line
  }, [camera]);

  const startRecording = () => {
    try {
      if (stream) {
        const options: MediaRecorderOptions = {
          mimeType: "video/mp4",
          audioBitsPerSecond: 256 * 1024,
          videoBitsPerSecond: 1024 * 1024,
        };
        const recorder = new MediaRecorder(stream, options);
        recorder.ondataavailable = handleDataAvailable;
        recorder.start();
        setMediaRecorder(recorder);
        setRecordingTime(0.1);
        setRecording(RecordingState.Recording);
        recordingTimeIntervalRef.current = setInterval(() => {
          setRecordingTime((prevTime) => prevTime + 1);
        }, 1000);
      }
    } catch (err) {
      console.error(`Error on start recording: ${err}`);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(RecordingState.Recorded);
      clearInterval(recordingTimeIntervalRef.current);
      setRecordingTime(0);
    }
  };

  const repeatRecording = () => {
    if (mediaRecorder) {
      setVideoUrl("");
      setRecording(RecordingState.Idle);
    }
  };

  const handleDataAvailable = (event: BlobEvent) => {
    if (event.data.size > 0) {
      const url = URL.createObjectURL(event.data);
      setVideoUrl(url);
    }
  };

  const switchCamera = () => {
    setCamera(
      (prevCamera) => (prevCamera + 1) % videoDeviceIdsRef.current.length
    );
  };

  const getRecordingTime = (time: number) => {
    const minutes = parseInt((time / 60).toFixed(0));
    const seconds = parseInt((time % 60).toFixed(0));
    return `${minutes > 9 ? minutes : `0${minutes}`}:${
      seconds > 9 ? seconds : `0${seconds}`
    }`;
  };

  return {
    startRecording,
    stopRecording,
    repeatRecording,
    switchCamera,
    getRecordingTime,
  };
};
