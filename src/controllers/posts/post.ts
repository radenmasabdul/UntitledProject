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

export const createPost = async (req: Request, res: Response) => {
    const { contentText } = req.body;
    const userId = req.user?.id;
    const file = req.file;
  
    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User ID is required",
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
          usersId: userId,
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
