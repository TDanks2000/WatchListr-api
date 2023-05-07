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

  if (amIInDB) return true;
  return false;
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

export { addMovie, checkMovie };
