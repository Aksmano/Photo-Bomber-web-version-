import { v4 } from "uuid";
import { MediaFileChunkMetadata } from "../dto/MediaFileChunkMetadata";

export const useMediaFileUpload = () => {
  const getFileTypeName = (type: string) => type.split("/")[1];

  const sliceFile = (file: File, chunkSize: number) => {
    let chunks = [];
    let currentByte = 0;

    while (currentByte < file.size) {
      let chunk = file.slice(currentByte, currentByte + chunkSize);
      chunks.push(chunk);
      currentByte += chunkSize;
    }

    return chunks;
  };

  const uploadChunks = async (
    chunks: Blob[],
    url: string,
    size: number,
    fileName: string,
    fileType: string,
    onFulfilled: () => void
  ) => {
    const responses: Response[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const fileChunk: MediaFileChunkMetadata = {
        fileName,
        fileType,
        chunkSize: size.toString(),
        chunkIndex: i,
        totalChunks: chunks.length,
      };

      const formData = new FormData();
      formData.append("chunk", chunks[i]);
      formData.append("chunkMetadata", JSON.stringify(fileChunk));

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      responses.push(response);

      onFulfilled();

      // requests.push(
      //   fetch(url, {
      //     method: "POST",
      //     body: formData,
      //   }).then((res) => {
      //     onFulfilled();
      //     return res;
      //   })
      // );
    }

    return responses;
  };

  const uploadMediaFileToDrive = async (
    file: File,
    chunkSize: number,
    onUpload: (chunks: Blob[]) => void,
    onSuccess: () => void,
    onError: (error: any) => void
  ) => {
    if (!file) return;

    try {
      const chunks = sliceFile(file, chunkSize);
      const responses = await uploadChunks(
        chunks,
        "api/upload",
        file.size,
        v4(),
        getFileTypeName(file.type),
        () => {
          onUpload(chunks);
        }
      );

      // const response = await request;
      if (!responses.every((res) => res.ok)) {
        throw new Error("Could not send data properly");
        // throw new Error(await responses.text());
      }

      onSuccess();
    } catch (error) {
      onError(error);
    }
  };

  const downloadMediaFile = (fileUrl: string, fileName: string): void => {
    const link = document.createElement("a");

    link.href = fileUrl;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    uploadMediaFileToDrive,
    downloadMediaFile,
  };
};
