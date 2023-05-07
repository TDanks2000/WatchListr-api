import TMDB from "../src/dataCollectors/tmdb";
import { MediaType } from "../src/types";

const tmdb = new TMDB();

const start = async (type: MediaType) => {
  await tmdb.downloadAndParse(type);
};

(async () => {
  await start(MediaType.MOVIE);

  //run every week
  setInterval(async () => {
    await start(MediaType.MOVIE);
  }, 604800000);
})();
