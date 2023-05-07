import { PrismaClient } from "@prisma/client";
import console from "./console";

const prisma = new PrismaClient();

interface DataProps {
  id: number;
  title: string;
  description: string;
  release_date: string;
  poster: string;
  background: string;
  genres: any[];
  rating: number;
  runtime: number;
  similar: any[];
  cast: any[];
}

const checkMovie = async (id: number) => {
  // check if id is already in db
  const amIInDB = await prisma.movies.findUnique({
    where: {
      id: id,
    },
  });

  return amIInDB ? true : false;
};

const addMovie = async (data: DataProps) => {
  // check if id is already in db
  const amIInDB = await checkMovie(data.id);

  if (!amIInDB) {
    const movie = await prisma.movies.create({
      data,
    });

    return movie;
  }
};

const checkTv = async (id: number) => {
  // check if id is already in db
  const amIInDB = await prisma.tvShows.findUnique({
    where: {
      id: id,
    },
  });

  return amIInDB ? true : false;
};

const addTv = async (data: DataProps) => {
  // check if id is already in db
  const amIInDB = await checkTv(data.id);

  if (!amIInDB) {
    const tv = await prisma.tvShows.create({
      data,
    });

    return tv;
  }
};

export { addMovie, checkMovie, checkTv, addTv };
