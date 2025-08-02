import { Request, Response } from 'express';
import { ResponseService } from '../utils/response';
import { Database } from '../database/db';
import { Blog } from '../models/blogModal';

export class BlogController {
    
    public async createBlog(req: Request, res: Response) {
        try {
            const blogData = req.body;
            
            if (!req.user || req.user.role !== 'admin') {
                return ResponseService({
                    res,
                    status: 403,
                    success: false,
                    message: "Only admins can create blogs"
                });
            }

            
            blogData.author = req.user.email;

            const blog = await Database.Blog.create(blogData);

            return ResponseService({
                res,
                status: 201,
                data: blog,
                message: "Blog created successfully"
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

    // Get all published blogs (Public)
    public async getAllBlogs(req: Request, res: Response) {
        try {
            const blogs = await Database.Blog.findAll({
                where: {
                    isPublished: true
                },
                include: [
                    {
                        model: Database.User,
                        as: 'authorDetails',
                        attributes: ['id', 'name', 'email']
                    },
                    {
                        model: Database.Comment,
                        as: 'comments',
                        attributes: ['id']
                    },
                    {
                        model: Database.Like,
                        as: 'likes',
                        attributes: ['id']
                    }
                ],
                attributes: {
                    include: [
                        [Database.database.literal('(SELECT COUNT(*) FROM "comments" WHERE "comments"."blogId" = "Blog"."id")'), 'commentCount'],
                        [Database.database.literal('(SELECT COUNT(*) FROM "likes" WHERE "likes"."blogId" = "Blog"."id")'), 'likeCount']
                    ]
                }
            });

            return ResponseService({
                res,
                data: blogs,
                message: "Blogs fetched successfully"
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

    // Get a single blog by ID (Public for published, Admin for all)
    public async getBlogById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const blog = await Database.Blog.findOne({
                where: { id },
                include: [
                    {
                        model: Database.Comment,
                        as: 'comments',
                        include: [{
                            model: Database.User,
                            as: 'user',
                            attributes: ['id', 'name', 'email']
                        }]
                    },
                    {
                        model: Database.Like,
                        as: 'likes',
                        attributes: ['id', 'userId']
                    }
                ]
            });

            if (!blog) {
                return ResponseService({
                    res,
                    status: 404,
                    success: false,
                    message: "Blog not found"
                });
            }

            // Check if the blog is published or if the user is an admin
            if (!blog.isPublished && (!req.user || req.user.role !== 'admin')) {
                return ResponseService({
                    res,
                    status: 403,
                    success: false,
                    message: "This blog is not published"
                });
            }

            return ResponseService({
                res,
                data: blog,
                message: "Blog fetched successfully"
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

    // Update a blog (Admin only)
    public async updateBlog(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            if (!req.user || req.user.role !== 'admin') {
                return ResponseService({
                    res,
                    status: 403,
                    success: false,
                    message: "Only admins can update blogs"
                });
            }

            const blog = await Database.Blog.findByPk(id);

            if (!blog) {
                return ResponseService({
                    res,
                    status: 404,
                    success: false,
                    message: "Blog not found"
                });
            }

            await blog.update(updateData);

            return ResponseService({
                res,
                data: blog,
                message: "Blog updated successfully"
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

    // Delete a blog (Admin only)
    public async deleteBlog(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!req.user || req.user.role !== 'admin') {
                return ResponseService({
                    res,
                    status: 403,
                    success: false,
                    message: "Only admins can delete blogs"
                });
            }

            const blog = await Database.Blog.findByPk(id);

            if (!blog) {
                return ResponseService({
                    res,
                    status: 404,
                    success: false,
                    message: "Blog not found"
                });
            }

            await blog.destroy();

            return ResponseService({
                res,
                message: "Blog deleted successfully"
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
