require("dotenv").config();

import fs from "fs";
import { FileType, MediaType } from "../types";
import { Constants, Download, console, updateDB, utils } from "../utils";
import axios from "axios";

class TMDB {
  readonly name = "TMDB";
  protected apiUrl = "https://api.themoviedb.org/3";
  protected apiKey = process.env.TMDB_API_KEY;

  downloadAndParse = async (type: MediaType) => {
    const date = this.getUTCDateString();
    const downloadURL: string = `https://files.tmdb.org/p/exports/${type}_ids_${date}.json.gz`;
    const fileName: string = `${this.name}_${type}`;

    console.log(downloadURL);

    const downloader = new Download(downloadURL, fileName, FileType.JSON);
    const file = await this.downloadIdsFile(downloader);

    this.parseIdFile(file, type);
  };

  private downloadIdsFile = async (downloader: Download) => {
    const file = await downloader.downloadFile();
    return file;
  };

  private parseIdFile = async (filePath: string, type: MediaType) => {
    // read file
    const file = fs.readFileSync(filePath, "utf8");

    // parse file
    for (const line of file.split("\n")) {
      const json = JSON.parse(line);
      const id = json.id;

      const check =
        type === MediaType.MOVIE
          ? await updateDB.checkMovie(id)
          : await updateDB.checkTv(id);

      if (!check) {
        const tmdbInfoUrl = `${this.apiUrl}/${
          type === MediaType.MOVIE ? "movie" : "tv"
        }/${id}?api_key=${
          this.apiKey
        }&language=en-US&append_to_response=release_dates,watch/providers,alternative_titles,credits,external_ids,images,keywords,recommendations,reviews,similar,translations,videos&include_image_language=en`;
        try {
          const { data } = await axios.get(tmdbInfoUrl);
          const title = data.title ?? data.name ?? "";
          const description = data.overview ?? "";
          const release_date = data.release_date ?? "";
          const poster = data.poster_path ?? "";
          const backdrop = data.backdrop_path ?? "";
          const genres = data.genres.map((genre: any) => genre.name);
          const rating = data.vote_average ?? "";
          const runtime = data.runtime ?? "";
          const similar = data?.similar?.results.map((result: any) => ({
            poster: result.poster_path,
            backdrop: result.backdrop_path,
            description: result.overview,
            title: result.title ?? result.name,
            rating: result.vote_average,
          }));
          const cast = data.credits.cast.map((cast: any) => ({
            name: cast.name,
            character: cast.character,
            image: cast.profile_path,
            known_for: cast.known_for_department,
            gender: cast.gender,
          }));

          const updateData = {
            id,
            title,
            description,
            release_date,
            poster,
            background: backdrop,
            genres,
            rating,
            runtime,
            similar,
            cast,
          };

          // add to db
          type === MediaType.MOVIE
            ? await updateDB.addMovie(updateData)
            : await updateDB.addTv(updateData);

          this.updateCurrentId(id, type);

          console.info(`Updated ${id} and added it to the db...`);
          utils.wait(500);
        } catch (error) {
          console.error(
            `there was an error with ${id}: ${(error as Error).message}`
          );
          continue;
        }
      } else {
        console.warn(
          `there was an error with ${id}. or it is already in the db....`
        );
      }
    }
  };

  /* Used to formulate a date string based on UTC time. */
  private getUTCDateString = (): string => {
    const date = new Date();

    // if time is before
    if (!(date.getUTCHours() >= 8 && date.getUTCMinutes() >= 1))
      date.setDate(date.getDate() - 1);

    // Get each individual component of the full, human-readable date.
    const year: string = date.getUTCFullYear().toString().padStart(2, "0");
    const month: string = date.getUTCMonth().toString().padStart(2, "0");
    const day: string = date.getUTCDate().toString().padStart(2, "0");

    return `${month}_${day}_${year}`;
  };

  private updateCurrentId = (currentId: number, type: MediaType) => {
    const currentIds = JSON.parse(
      fs.readFileSync(Constants.currentIdsFile, "utf8")
    );

    // update currentIds.tmdb
    type === MediaType.MOVIE
      ? (currentIds.tmdb.movie = currentId)
      : (currentIds.tmdb.tv = currentId);

    fs.writeFileSync(
      Constants.currentIdsFile,
      JSON.stringify(currentIds, null, 2)
    );
  };

  private checkCurrentId = () => {
    const currentIds = JSON.parse(
      fs.readFileSync(Constants.currentIdsFile, "utf8")
    );

    return currentIds.tmdb;
  };
}

export default TMDB;
