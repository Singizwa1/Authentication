import { Request, Response } from 'express';
import { ResponseService } from '../utils/response';
import { Database } from '../database/db';

export class CommentLikeController {
    // Create a comment
    public async createComment(req: Request, res: Response) {
        try {
            const { content, blogId } = req.body;

            if (!req.user) {
                return ResponseService({
                    res,
                    status: 401,
                    success: false,
                    message: "Authentication required"
                });
            }

            const blog = await Database.Blog.findByPk(blogId);
            if (!blog) {
                return ResponseService({
                    res,
                    status: 404,
                    success: false,
                    message: "Blog not found"
                });
            }

            const comment = await Database.Comment.create({
                content,
                blogId,
                userId: req.user.id
            });

            return ResponseService({
                res,
                status: 201,
                data: comment,
                message: "Comment created successfully"
            });
        } catch (error: any) {
            return ResponseService({
                res,
                status: 500,
                success: false,
                message: error.message
            });
        }
    }

    // Get comments for a blog
    public async getBlogComments(req: Request, res: Response) {
        try {
            const { blogId } = req.params;

            const comments = await Database.Comment.findAll({
                where: { blogId },
                include: [
                    {
                        model: Database.User,
                        as: 'user',
                        attributes: ['id', 'name', 'email']
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            return ResponseService({
                res,
                data: comments,
                message: "Comments fetched successfully"
            });
        } catch (error: any) {
            return ResponseService({
                res,
                status: 500,
                success: false,
                message: error.message
            });
        }
    }

    // Like/Unlike a blog
    public async toggleLike(req: Request, res: Response) {
        try {
            const { blogId } = req.params;

            if (!req.user) {
                return ResponseService({
                    res,
                    status: 401,
                    success: false,
                    message: "Authentication required"
                });
            }

            const blog = await Database.Blog.findByPk(blogId);
            if (!blog) {
                return ResponseService({
                    res,
                    status: 404,
                    success: false,
                    message: "Blog not found"
                });
            }

            // Check if user has already liked the blog
            const existingLike = await Database.Like.findOne({
                where: {
                    blogId,
                    userId: req.user.id
                }
            });

            if (existingLike) {
                // Unlike the blog
                await existingLike.destroy();
                return ResponseService({
                    res,
                    message: "Blog unliked successfully"
                });
            } else {
                // Like the blog
                await Database.Like.create({
                    blogId,
                    userId: req.user.id
                });
                return ResponseService({
                    res,
                    status: 201,
                    message: "Blog liked successfully"
                });
            }
        } catch (error: any) {
            return ResponseService({
                res,
                status: 500,
                success: false,
                message: error.message
            });
        }
    }

    // Get like count for a blog
    public async getBlogLikes(req: Request, res: Response) {
        try {
            const { blogId } = req.params;

            const likeCount = await Database.Like.count({
                where: { blogId }
            });

            let userLiked = false;
            if (req.user) {
                const userLike = await Database.Like.findOne({
                    where: {
                        blogId,
                        userId: req.user.id
                    }
                });
                userLiked = !!userLike;
            }

            return ResponseService({
                res,
                data: {
                    likeCount,
                    userLiked
                },
                message: "Like count fetched successfully"
            });
        } catch (error: any) {
            return ResponseService({
                res,
                status: 500,
                success: false,
                message: error.message
            });
        }
    }
}
