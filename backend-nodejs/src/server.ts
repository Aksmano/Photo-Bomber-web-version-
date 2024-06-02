import express from "express";
import multer from "multer";
import { google } from "googleapis";
import fs from "fs";
import path from "path";
import cors from "cors";
import * as serverConfig from '../config/server/server.config.json';

const app = express();
const upload = multer({ dest: "temp/uploads/" });
const PORT = 5000;
const credentialsPath: string = serverConfig.driveCredentialsPath;

app.use(cors());
app.use(express.json());

// Load service account credentials
const KEYFILEPATH = path.join(
  __dirname,
  credentialsPath
);

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: serverConfig.scopes,
});

const driveService = google.drive({ version: "v3", auth });

app.post("/upload", upload.single("file"), async (req, res) => {
  if (!!req.file) {
    try {
      const response = await driveService.files.create({
        requestBody: {
          name: req.file.originalname,
          parents: serverConfig.driveDirectories,
        },
        media: {
          mimeType: req.file.mimetype,
          body: fs.createReadStream(req.file.path),
        },
        fields: "id,name",
      });
      res.status(200).send(`File uploaded with ID: ${response.data.id}`);
    } catch (error) {
      res.status(500).send(`Error uploading file: ${error}`);
    } finally {
      fs.unlinkSync(req.file.path);
    }
  } else {
    res.status(400).send(`File not sent`);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
