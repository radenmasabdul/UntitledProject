import { Request, Response } from "express";
import prisma from "@/configs/database";

export const getAllPosts = async (req: Request, res: Response) => {
    try {
        const posts = await prisma.posts.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                users: {
                    select: {
                        id: true,
                        username: true,
                        fullname: true,
                        email: true,
                        profile_image: true,
                        banner: true,
                        bio: true,
                    }
                },
                _count: {
                    select: {
                        comments: true,
                        likes: true,
                    },
                },
            },
        });

        res.status(200).json({
            success: true,
            message: "All posts retrieved successfully",
            data: posts,
        });
        return;
        
    } catch (error) {
        console.error("Get User Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export const getPostByid = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
      const post = await prisma.posts.findUnique({
          where: {
              id: id,
          },
          include: {
              users: {
                  select: {
                      id: true,
                      username: true,
                      fullname: true,
                      email: true,
                      profile_image: true,
                      banner: true,
                      bio: true,
                  }
              },
              _count: {
                  select: {
                      comments: true,
                      likes: true,
                  },
              },
          },
      });

      if (!post) {
          res.status(404).json({
              success: false,
              message: "Post not found",
          });
          return;
      }

      res.status(200).json({
          success: true,
          message: "Post retrieved successfully",
          data: post,
      });
      return;

  } catch (error) {
      console.error("Get Post Error:", error);
      res.status(500).json({
          success: false,
          message: "Internal server error",
      });
  }
}
export const createPost = async (req: Request, res: Response) => {
    const { contentText, usersId, userId } = req.body;
    const loggedInUserId = req.user?.id;
    const file = req.file;
  
    if (!loggedInUserId) {
      res.status(400).json({
        success: false,
        message: "User ID is required",
      });
      return;
    }

    if (userId || usersId) {
        res.status(403).json({
            success: false,
            message: "You are not authorized to create this post",
        });
        return;
    }
  
    // Tentukan mediaType berdasarkan file yang dikirim
    let mediaType: "PHOTO" | "VIDEO" | "MUSIC" | "TEXT" = "TEXT"; // Default ke text jika tidak ada file
  
    if (file) {
        const mimetype = file.mimetype;
      
        switch (true) {
          case mimetype.startsWith("image/"):
            mediaType = "PHOTO";
            break;
          case mimetype.startsWith("video/"):
            mediaType = "VIDEO";
            break;
          case mimetype.startsWith("audio/"):
            mediaType = "MUSIC";
            break;
          default:
            res.status(400).json({
              success: false,
              message: "Unsupported file type",
            });
            return;
        }
      }      
  
    try {
      const newPost = await prisma.posts.create({
        data: {
          usersId: loggedInUserId,
          contentText: contentText || null,
          contentImage: file ? file.filename : null,
          mediaType,
        },
      });
  
      res.status(201).json({
        success: true,
        message: "Post created successfully",
        data: newPost,
      });
  
    } catch (error) {
      console.error("Create Post Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
};

export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const loggedInUserId = req.user.id;

  try {
      const existingPost = await prisma.posts.findUnique({
          where: { id },
      });

      if (!existingPost) {
          res.status(404).json({
              success: false,
              message: `Post with ID ${id} not found`,
          });
          return;
      }

      if (existingPost.usersId !== loggedInUserId) {
          res.status(403).json({
              success: false,
              message: "You are not authorized to delete this post",
          });
          return;
      }

      await prisma.posts.delete({
          where: { id },
      });

      res.status(200).json({
          success: true,
          message: "Post deleted successfully",
      });

  } catch (error) {
      console.error("Delete Post Error:", error);
      res.status(500).json({
          success: false,
          message: "Internal server error",
      });
  }
};

export const updatePost = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { contentText } = req.body;
    const loggedInUserId = req.user?.id;

    try {
        const existingPost = await prisma.posts.findUnique({
            where: { id },
        });

        if (!existingPost) {
            res.status(404).json({
                success: false,
                message: `Post with ID ${id} not found`,
            });
            return;
        }

        if (existingPost.usersId !== loggedInUserId) {
            res.status(403).json({
                success: false,
                message: "You are not authorized to edit this post",
            });
            return;
        }

        const updatedPost = await prisma.posts.update({
            where: { id },
            data: {
                contentText: contentText || existingPost.contentText,
            },
        });

        res.status(200).json({
            success: true,
            message: "Post updated successfully",
            data: updatedPost,
        });

    } catch (error) {
        console.error("Update Post Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
