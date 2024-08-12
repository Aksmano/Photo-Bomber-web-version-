import express from "express";
import multer from "multer";
import { google } from "googleapis";
import fs from "fs";
import path from "path";
import cors from "cors";
import * as serverConfig from "../config/server/server.config.json";
import { ChunkFileMetadata } from "./dto/ChunkFileMetadata";
import { getFullFileName, mergeChunks } from "./utils";

const app = express();
const upload = multer({ dest: "temp/uploads/" });
const PORT = 5000;
const credentialsPath: string = serverConfig.driveCredentialsPath;

app.use(cors());
app.use(express.json());

// Load service account credentials
const KEYFILEPATH = path.join(__dirname, credentialsPath);

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: serverConfig.scopes,
});

const driveService = google.drive({ version: "v3", auth });

app.post("/api/upload", upload.single("chunk"), async (req, res) => {
  if (!!req.file) {
    try {
      const file = { ...req.file };
      const { chunkIndex, fileName, totalChunks, fileType } = JSON.parse(
        req.body.chunkMetadata
      ) as ChunkFileMetadata;
      const chunkPath = file.path;

      const fileDir = path.join(__dirname, "temp/uploads", fileName);
      if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir, { recursive: true });
      }

      const newChunkPath = path.join(fileDir, `${chunkIndex}`);
      fs.renameSync(chunkPath, newChunkPath);

      // Check if all chunks are uploaded
      const uploadedChunks = fs.readdirSync(fileDir);
      if (uploadedChunks.length == totalChunks) {
        console.log(uploadedChunks.length);

        mergeChunks(fileDir, fileName, fileType, async (finalPath) => {
          // Send to google drive and clear cache
          const response = await driveService.files.create({
            requestBody: {
              name: getFullFileName(fileName, fileType),
              parents: serverConfig.driveDirectories,
            },
            media: {
              mimeType: file.mimetype,
              body: fs.createReadStream(finalPath),
            },
            fields: "id,name",
          });

          if (response.status > 299) {
            // res.status(response.statusText).send(response.statusText);
            console.error(`${response.statusText}: ${response.statusText}`);
            return;
          }

          fs.rmSync(fileDir, { recursive: true, force: true });

          console.log(`File ${fileName} uploaded to google drive`);
        });

        res
          .status(201)
          .send(`File uploaded to cache and soon will be to google drive`); // ${response.data.id}`);

        return;
      }
      res.status(200).send(`Uploaded chunk ${chunkIndex}`);
    } catch (error) {
      res.status(500).send(`Error uploading file: ${error}`);
    } finally {
      // fs.unlinkSync(req.file.path);
    }
  } else {
    res.status(400).send(`File not sent`);
  }
});

// app.post("/api/upload", upload.single("chunk"), async (req, res) => {
//   if (!!req.file) {
//     try {
//       const response = await driveService.files.create({
//         requestBody: {
//           name: req.file.originalname,
//           parents: serverConfig.driveDirectories,
//         },
//         media: {
//           mimeType: req.file.mimetype,
//           body: fs.createReadStream(req.file.path),
//         },
//         fields: "id,name",
//       });
//       res.status(200).send(`File uploaded with ID: ${response.data.id}`);
//     } catch (error) {
//       res.status(500).send(`Error uploading file: ${error}`);
//     } finally {
//       fs.unlinkSync(req.file.path);
//     }
//   } else {
//     res.status(400).send(`File not sent`);
//   }
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
