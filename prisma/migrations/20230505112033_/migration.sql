/*
  Warnings:

  - You are about to drop the column `Seasons` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `relations` on the `Movies` table. All the data in the column will be lost.
  - You are about to drop the column `relations` on the `TvShows` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Anime" DROP COLUMN "Seasons",
ADD COLUMN     "episodes" JSONB;

-- AlterTable
ALTER TABLE "Movies" DROP COLUMN "relations",
ADD COLUMN     "recommendations" JSONB,
ALTER COLUMN "rating" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "TvShows" DROP COLUMN "relations",
ADD COLUMN     "recommendations" JSONB;
