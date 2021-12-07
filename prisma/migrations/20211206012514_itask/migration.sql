/*
  Warnings:

  - Made the column `is_completed` on table `todo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `todo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "todo" DROP CONSTRAINT "todo_userId_fkey";

-- AlterTable
ALTER TABLE "todo" ALTER COLUMN "is_completed" SET NOT NULL,
ALTER COLUMN "is_completed" DROP DEFAULT,
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "name" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "todo" ADD CONSTRAINT "todo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
