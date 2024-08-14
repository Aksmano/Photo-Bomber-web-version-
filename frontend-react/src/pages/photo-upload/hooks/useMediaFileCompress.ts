import { FFmpeg } from "@ffmpeg/ffmpeg";
// import {  } from "@ffmpeg/ffmpeg/dist";
import { fetchFile } from "@ffmpeg/util";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { v4 } from "uuid";
import { UploadType } from "../domain/UploadType";
import { FileData } from "@ffmpeg/ffmpeg/dist/esm/types";
import { useIndexedDBMediaFile } from "./useIndexedDBMediaFile";

export enum IDBMediaFileBinaryDataKeys {
  Data = "cache_data",
  Type = "cache_type",
}

export interface IDBMediaFileBinaryData {
  data: FileData;
  type: UploadType;
}

export const useMediaFileCompress = (
  setLoadingProgress: Dispatch<SetStateAction<number>>
) => {
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [compressionProgress, setCompressionProgress] = useState<number>(0);

  const ffmpegRef = useRef<FFmpeg>(new FFmpeg());
  const { addMediaFileBinaryData } = useIndexedDBMediaFile();

  useEffect(() => {
    if (compressionProgress > 0 && videoDuration > 0)
      setLoadingProgress(
        Math.round((compressionProgress / videoDuration) * 100)
      );
    //eslint-disable-next-line
  }, [compressionProgress]);

  const loadffmpeg = async () => {
    ffmpegRef.current.on("log", ({ message }) => {
      if (!message.includes("time=")) {
        return;
      }

      const times = message
        .split("time=")[1]
        .split(" ")[0]
        .split(":")
        .reverse()
        .map((t, i) => parseFloat(t) * Math.pow(60, i));

      if (!times.every((t) => t >= 0)) {
        return;
      }

      setCompressionProgress(times.reduce((acc, v) => acc + v, 0));
    });
    await ffmpegRef.current.load();
  };

  const compressPhoto = async (
    file: File,
    type: string,
    quality: number = 28
  ) => {
    if (!ffmpegRef.current.loaded) {
      await loadffmpeg();
    }

    await ffmpegRef.current.writeFile(`input.${type}`, await fetchFile(file));
    await ffmpegRef.current.exec([
      "-i",
      `input.${type}`,
      "-q:v",
      "16",
      "output.jpg",
    ]);
    const data = await ffmpegRef.current.readFile("output.jpg");

    const imageFile = new File([data], v4(), { type: `image/jpg` });

    setVideoDuration(0);
    setCompressionProgress(0);

    await addMediaFileBinaryData({ data, type: UploadType.Photo });

    return {
      fileUrl: URL.createObjectURL(imageFile),
      compressedFile: imageFile,
    };
  };

  const compressVideo = async (file: File, type: string) => {
    if (!ffmpegRef.current.loaded) {
      await loadffmpeg();
    }

    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);

    const getVideoDuration = () => {
      return new Promise<number>((resolve) => {
        video.onloadedmetadata = () => {
          resolve(parseFloat(video.duration.toFixed(2)));
          URL.revokeObjectURL(video.src);
        };
      });
    };

    const videoDur = await getVideoDuration();
    setVideoDuration(videoDur);

    await ffmpegRef.current.writeFile(`input.${type}`, await fetchFile(file));
    await ffmpegRef.current.exec([
      "-i",
      `input.${type}`, // Input file
      "-b:v",
      "1M", // Bitrate for compression
      "-c:v",
      "libx264", // Codec
      "-preset",
      "ultrafast", // Compression quality
      "-crf",
      "28", // Constant Rate Factor (adjust quality)
      "output.mp4",
    ]);
    const data = await ffmpegRef.current.readFile("output.mp4");

    const videoFile = new File([data], v4(), { type: `video/mp4` });
    setVideoDuration(0);
    setCompressionProgress(0);
    setLoadingProgress(0);

    await addMediaFileBinaryData({ data, type: UploadType.Video });

    return {
      fileUrl: URL.createObjectURL(videoFile),
      compressedFile: videoFile,
    };
  };

  return {
    compressPhoto,
    compressVideo,
  };
};
