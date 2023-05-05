import fs from "fs";
import path from "path";
import zlib from "zlib";
import axios from "axios";
import { FileType, IFile } from "../types";
import Console from "@tdanks2000/fancyconsolelog";

const log = new Console();

class Downloader {
  public destinationFile!: IFile;
  protected fileUrl!: string;
  private fileName!: string;
  private static readonly downloadsPath = path.join(
    __dirname,
    "..",
    "..",
    "downloads"
  );

  constructor(fileUrl: string, fileName: string, fileType: FileType) {
    this.fileUrl = fileUrl;

    const date = this.getUTCDateString();
    this.fileName = this.sanitizeAndSetFileName(fileName, fileType, date);

    // Sets legal file name to have destination in downloads folder:
    this.destinationFile = {
      fileType: fileType,
      filePath: path.join(Downloader.downloadsPath, this.fileName),
    };
  }

  public downloadFile = async (): Promise<any> => {
    // Return if already exists, logging to console.
    const exists = fs.existsSync(this.destinationFile.filePath);
    if (exists) {
      log.warn("file already exists!!");
      return this.destinationFile.filePath;
    }

    // Download file!
    await this.fetchFileFromUrl();

    return this.destinationFile.filePath;
  };

  static cleanupDownloads = (): void => {
    const files = fs.readdirSync(this.downloadsPath, { withFileTypes: true });
    // If not the README, delete.
    files.forEach(async (file) => {
      const dir = path.join(this.downloadsPath, file.name);
      if (file.name != "README.md") fs.unlinkSync(dir);
    });
  };

  /* Used to formulate a date string based on UTC time. */
  private getUTCDateString = (): string => {
    const date = new Date();

    // Get each individual component of the full, human-readable date.
    const year: string = date.getUTCFullYear().toString().padStart(2, "0");
    const month: string = date.getUTCMonth().toString().padStart(2, "0");
    const day: string = date.getUTCDate().toString().padStart(2, "0");

    return `${month}-${day}-${year}`;
  };

  /* Removes illegal characters from file string (https://en.wikipedia.org/wiki/Filename#Reserved_characters_and_words). */
  private sanitizeAndSetFileName = (
    fileName: string,
    fileType: FileType,
    date: string
  ): string => {
    const sanitized = `${fileName}-${date}.${fileType as string}`;
    return sanitized.replace(/[/\\?%*:|"<>]/g, "");
  };

  /* Where the actual fetching of the file happens! 🌟 */
  private fetchFileFromUrl = async (): Promise<void> => {
    try {
      const { data } = await axios.get(this.fileUrl as string, {
        responseType: "arraybuffer",
      });

      // Decompress the downloaded gzip file:
      log.info("Decompressing file...");
      const decompressed = zlib.gunzipSync(data);

      fs.writeFileSync(this.destinationFile.filePath, decompressed, "utf-8");
      log.info(
        `File ${this.fileName} has been saved @ ${this.destinationFile.filePath}`
      );
    } catch (err) {
      throw new Error((err as Error).message);
    }
  };
}

export default Downloader;

/**
 * based on https://github.com/aidanjuma/genkai/blob/master/src/utils/downloader.ts
 * from https://github.com/aidanjuma
 */
