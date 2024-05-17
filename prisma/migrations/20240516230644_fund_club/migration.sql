/*
  Warnings:

  - Added the required column `club_id` to the `FundRaise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FundRaise" ADD COLUMN     "club_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "FundRaise" ADD CONSTRAINT "FundRaise_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
