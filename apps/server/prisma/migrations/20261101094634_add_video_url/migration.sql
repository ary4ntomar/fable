/*
  Warnings:

  - Added the required column `videoUrl` to the `AvatarVideo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AvatarVideo" ADD COLUMN     "videoUrl" TEXT NOT NULL;
