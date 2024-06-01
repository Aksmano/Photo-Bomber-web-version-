import express from "express";
import multer from "multer";
import { google } from "googleapis";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
const upload = multer({ dest: "temp/uploads/" });
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Load service account credentials
const KEYFILEPATH = path.join(
  __dirname,
  "../config/credentials/googledrive.service-account.json"
);
const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const googleDriveDir = "1R8WAfexs_TPoxEo3JKy_-6ABInmZeRFk";

const driveService = google.drive({ version: "v3", auth });

app.post("/upload", upload.single("file"), async (req, res) => {
  console.log(req.file);

  if (!!req.file) {
    try {
      const response = await driveService.files.create({
        requestBody: {
          name: req.file.originalname,
          parents: [googleDriveDir],
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
    res.status(400).send(`Bad request`);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
