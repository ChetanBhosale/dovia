/*
  Warnings:

  - You are about to drop the column `sandboxUrl` on the `Fragment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sandboxId]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sandboxUrl]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Fragment" DROP COLUMN "sandboxUrl";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "sandboxId" TEXT,
ADD COLUMN     "sandboxUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Project_sandboxId_key" ON "Project"("sandboxId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_sandboxUrl_key" ON "Project"("sandboxUrl");
