import fs from "fs";
import path from "path";

export const getFullFileName = (fileName: string, fileType: string) =>
  `${fileName}.${fileType}`;

export const mergeChunks = async (
  dirPath: string,
  fileName: string,
  fileType: string,
  callback: (path: string) => Promise<void>
) => {
  return new Promise<string>((resolve, reject) => {
    try {
      const finalPath = path.join(
        __dirname,
        `/temp/uploads/${fileName}`,
        `${fileName}.${fileType}`
      );
      const writeStream = fs.createWriteStream(finalPath);

      // Read chunks in order
      const chunks = fs
        .readdirSync(dirPath)
        .sort((a, b) => parseInt(a) - parseInt(b));

      for (const chunk of chunks) {
        const chunkPath = path.join(dirPath, chunk);
        const data = fs.readFileSync(chunkPath);
        writeStream.write(data);
        fs.unlinkSync(chunkPath); // Remove chunk after writing
      }

      writeStream.on("finish", () => {
        callback(finalPath);
        resolve(finalPath);
      });
      writeStream.end();
    } catch (err) {
      reject(err);
    }
  });
};
