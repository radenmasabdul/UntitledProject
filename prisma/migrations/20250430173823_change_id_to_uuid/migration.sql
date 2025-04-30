/*
  Warnings:

  - The primary key for the `Attachment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Comment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `CommentViewer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Followers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Friends` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Like` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Messages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Notification` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Posts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PostsViewer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `RePosts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Story` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `StoryViewer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[followerId,followingId]` on the table `Followers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[usersId,friendId]` on the table `Friends` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_commentId_fkey";

-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_postsId_fkey";

-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_storyId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_postsId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_storyId_fkey";

-- DropForeignKey
ALTER TABLE "CommentViewer" DROP CONSTRAINT "CommentViewer_commentId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_postsId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_storyId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_commentId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_postsId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_relatedUsersId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_storyId_fkey";

-- DropForeignKey
ALTER TABLE "PostsViewer" DROP CONSTRAINT "PostsViewer_postsId_fkey";

-- DropForeignKey
ALTER TABLE "RePosts" DROP CONSTRAINT "RePosts_originalPostsId_fkey";

-- DropForeignKey
ALTER TABLE "StoryViewer" DROP CONSTRAINT "StoryViewer_storyId_fkey";

-- AlterTable
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "postsId" SET DATA TYPE TEXT,
ALTER COLUMN "commentId" SET DATA TYPE TEXT,
ALTER COLUMN "storyId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Attachment_id_seq";

-- AlterTable
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "postsId" SET DATA TYPE TEXT,
ALTER COLUMN "storyId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Comment_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Comment_id_seq";

-- AlterTable
ALTER TABLE "CommentViewer" DROP CONSTRAINT "CommentViewer_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "commentId" SET DATA TYPE TEXT,
ADD CONSTRAINT "CommentViewer_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "CommentViewer_id_seq";

-- AlterTable
ALTER TABLE "Followers" DROP CONSTRAINT "Followers_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Followers_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Followers_id_seq";

-- AlterTable
ALTER TABLE "Friends" DROP CONSTRAINT "Friends_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Friends_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Friends_id_seq";

-- AlterTable
ALTER TABLE "Like" DROP CONSTRAINT "Like_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "postsId" SET DATA TYPE TEXT,
ALTER COLUMN "storyId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Like_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Like_id_seq";

-- AlterTable
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Messages_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Messages_id_seq";

-- AlterTable
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "relatedUsersId" DROP NOT NULL,
ALTER COLUMN "postsId" SET DATA TYPE TEXT,
ALTER COLUMN "commentId" SET DATA TYPE TEXT,
ALTER COLUMN "storyId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Notification_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Notification_id_seq";

-- AlterTable
ALTER TABLE "Posts" DROP CONSTRAINT "Posts_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Posts_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Posts_id_seq";

-- AlterTable
ALTER TABLE "PostsViewer" DROP CONSTRAINT "PostsViewer_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "postsId" SET DATA TYPE TEXT,
ADD CONSTRAINT "PostsViewer_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "PostsViewer_id_seq";

-- AlterTable
ALTER TABLE "RePosts" DROP CONSTRAINT "RePosts_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "originalPostsId" SET DATA TYPE TEXT,
ADD CONSTRAINT "RePosts_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "RePosts_id_seq";

-- AlterTable
ALTER TABLE "Story" DROP CONSTRAINT "Story_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Story_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Story_id_seq";

-- AlterTable
ALTER TABLE "StoryViewer" DROP CONSTRAINT "StoryViewer_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "storyId" SET DATA TYPE TEXT,
ADD CONSTRAINT "StoryViewer_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "StoryViewer_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Followers_followerId_followingId_key" ON "Followers"("followerId", "followingId");

-- CreateIndex
CREATE UNIQUE INDEX "Friends_usersId_friendId_key" ON "Friends"("usersId", "friendId");

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_postsId_fkey" FOREIGN KEY ("postsId") REFERENCES "Posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postsId_fkey" FOREIGN KEY ("postsId") REFERENCES "Posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RePosts" ADD CONSTRAINT "RePosts_originalPostsId_fkey" FOREIGN KEY ("originalPostsId") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_postsId_fkey" FOREIGN KEY ("postsId") REFERENCES "Posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_relatedUsersId_fkey" FOREIGN KEY ("relatedUsersId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_postsId_fkey" FOREIGN KEY ("postsId") REFERENCES "Posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryViewer" ADD CONSTRAINT "StoryViewer_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostsViewer" ADD CONSTRAINT "PostsViewer_postsId_fkey" FOREIGN KEY ("postsId") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentViewer" ADD CONSTRAINT "CommentViewer_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
