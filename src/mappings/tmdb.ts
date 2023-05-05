import fs from "fs";
import { FileType } from "../types";
import { Download } from "../utils";
import Downloader from "../utils/downloader";

class TMDB {
  readonly name = "TMDB";
  protected apiUrl = "https://www.themoviedb.org";
  protected apiKey = process.env.TMDB_API_KEY;

  downloadAndParse = async (type: "tv_series" | "movie") => {
    const date = this.getUTCDateString();
    const downloadURL: string = `https://files.tmdb.org/p/exports/${type}_ids_${date}.json.gz`;
    const fileName: string = `${this.name}_${type}`;

    console.log(downloadURL);

    const downloader = new Download(downloadURL, fileName, FileType.JSON);
    const file = await this.downloadIdsFile(downloader);

    this.parseIdFile(file);
  };

  private downloadIdsFile = async (downloader: Downloader) => {
    return downloader.downloadFile();
  };

  private parseIdFile = async (filePath: string) => {
    // read file
    const file = fs.readFileSync(filePath, "utf8");
    // parse file

    for (const line of file.split("\n")) {
      const json = JSON.parse(line);
      const id = json.id;
    }
  };

  /* Used to formulate a date string based on UTC time. */
  private getUTCDateString = (): string => {
    const date = new Date();

    // Get each individual component of the full, human-readable date.
    const year: string = date.getUTCFullYear().toString().padStart(2, "0");
    const month: string = date.getUTCMonth().toString().padStart(2, "0");
    const day: string = date.getUTCDate().toString().padStart(2, "0");

    return `${month}_${day}_${year}`;
  };
}

(async () => {
  const tmdb = new TMDB();

  await tmdb.downloadAndParse("movie");
})();
