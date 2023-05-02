-- CreateTable
CREATE TABLE "Movies" (
    "id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "release_date" TEXT,
    "trailer" JSONB,
    "poster" TEXT,
    "background" TEXT,
    "genres" TEXT[],
    "rating" INTEGER,
    "relations" JSONB,
    "similar" JSONB,
    "cast" JSONB,
    "mappings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Movies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TvShows" (
    "id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "trailer" JSONB NOT NULL,
    "poster" TEXT,
    "background" TEXT,
    "season" TEXT,
    "seasonYear" INTEGER,
    "start_date" TEXT,
    "end_date" TEXT,
    "genres" TEXT[],
    "rating" INTEGER,
    "relations" JSONB,
    "similar" JSONB,
    "cast" JSONB,
    "Seasons" JSONB,
    "mappings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TvShows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Anime" (
    "id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "trailer" JSONB NOT NULL,
    "poster" TEXT,
    "background" TEXT,
    "season" TEXT,
    "seasonYear" INTEGER,
    "start_date" TEXT,
    "end_date" TEXT,
    "rating" INTEGER,
    "type" TEXT,
    "genres" TEXT[],
    "synonyms" TEXT[],
    "relations" JSONB,
    "cast" JSONB,
    "Seasons" JSONB,
    "mappings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Anime_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Movies_id_key" ON "Movies"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Movies_title_key" ON "Movies"("title");

-- CreateIndex
CREATE UNIQUE INDEX "TvShows_id_key" ON "TvShows"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TvShows_title_key" ON "TvShows"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Anime_id_key" ON "Anime"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Anime_title_key" ON "Anime"("title");
