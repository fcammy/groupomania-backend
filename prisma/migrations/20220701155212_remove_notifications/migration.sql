/*
  Warnings:

  - You are about to drop the `notifications` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `notifications` DROP FOREIGN KEY `notifications_postId_fkey`;

-- DropForeignKey
ALTER TABLE `notifications` DROP FOREIGN KEY `notifications_userId_fkey`;

-- DropTable
DROP TABLE `notifications`;
