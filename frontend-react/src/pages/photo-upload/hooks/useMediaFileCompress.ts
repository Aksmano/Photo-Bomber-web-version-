import { FFmpeg } from "@ffmpeg/ffmpeg";
// import {  } from "@ffmpeg/ffmpeg/dist";
import { fetchFile } from "@ffmpeg/util";
import { useRef } from "react";
import { v4 } from "uuid";

export const useMediaFileCompress = () => {
  const ffmpegRef = useRef<FFmpeg>(new FFmpeg());

  const compressPhoto = async (
    file: File,
    type: string,
    quality: number = 28
  ) => {
    if (!ffmpegRef.current.loaded) {
      await ffmpegRef.current.load();
    }

    // Write the input file to the ffmpeg.wasm virtual file system
    await ffmpegRef.current.writeFile(`input.${type}`, await fetchFile(file));

    // Run the ffmpeg command to compress the image with the specified quality
    await ffmpegRef.current.exec([
      "-i",
      `input.${type}`,
      //   "-vf",
      //   'scale="-1:1024"',
      "-q:v",
      "16",
      "output.jpg",
    ]);

    // Read the output image file
    const data = await ffmpegRef.current.readFile("output.jpg");

    console.log(data);

    // Create a Blob and object URL from the output image
    const imageFile = new File([data], v4(), { type: `image/jpeg` });
    return {
      fileUrl: URL.createObjectURL(imageFile),
      compressedFile: imageFile,
    };
  };

  const compressVideo = async (file: File, type: string) => {
    if (!ffmpegRef.current.loaded) {
      await ffmpegRef.current.load();
    }

    // Write the input file to the ffmpeg.wasm virtual file system
    await ffmpegRef.current.writeFile(`input.${type}`, await fetchFile(file));

    // Run the ffmpeg command to compress the image with the specified quality
    await ffmpegRef.current.exec([
      "-i",
      `input.${type}`, // Input file
      "-b:v",
      "1M", // Bitrate for compression
      "-c:v",
      "libx264", // Codec
      "-preset",
      "slow", // Compression quality
      "-crf",
      "28", // Constant Rate Factor (adjust quality)
      "output.mp4",
    ]);

    // Read the output image file
    const data = await ffmpegRef.current.readFile("output.mp4");

    // Create a Blob and object URL from the output image
    const videoFile = new File([data], v4(), { type: `video/mp4` });
    return {
      fileUrl: URL.createObjectURL(videoFile),
      compressedFile: videoFile,
    };
  };

  return {
    compressPhoto,
    compressVideo,
  };

  //   async function compressVideo(file) {
  //     if (!ffmpeg.isLoaded()) {
  //       await ffmpeg.load();
  //     }

  //     // Write the input file to the ffmpeg.wasm virtual file system
  //     ffmpeg.FS("writeFile", "input.mp4", await fetchFile(file));

  //     // Get the duration of the video
  //     await ffmpeg.run("-i", "input.mp4");
  //     const ffmpegOutput = ffmpeg.FS("readFile", "input.mp4");
  //     const durationMatch = /Duration: (\d+):(\d+):(\d+\.\d+)/.exec(ffmpegOutput);
  //     const durationInSeconds =
  //       parseInt(durationMatch[1]) * 3600 +
  //       parseInt(durationMatch[2]) * 60 +
  //       parseFloat(durationMatch[3]);

  //     // Calculate the target bitrate in kbps for a 100MB file
  //     const targetSizeInBits = 100 * 8 * 1024 * 1024;
  //     const targetBitrate = targetSizeInBits / durationInSeconds;

  //     // Run the ffmpeg command to compress the video with the calculated bitrate
  //     await ffmpeg.run(
  //       "-i",
  //       "input.mp4",
  //       "-b:v",
  //       `${Math.round(targetBitrate / 1000)}k`,
  //       "-c:a",
  //       "aac",
  //       "output.mp4"
  //     );

  //     // Read the output video file
  //     const data = ffmpeg.FS("readFile", "output.mp4");

  //     // Create a Blob and object URL from the output video
  //     const videoBlob = new Blob([data.buffer], { type: "video/mp4" });
  //     const url = URL.createObjectURL(videoBlob);

  //     // Display the compressed video
  //     document.getElementById("outputVideo").src = url;
  //   }
};
