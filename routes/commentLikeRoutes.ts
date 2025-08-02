import { Router } from 'express';
import { ValidationMiddleware } from '../middlewares/validationMiddleware';
import { CommentLikeController } from '../controller/CommentLikeController';
import { authMiddleware } from '../middlewares/authMiddleware';
import Joi from 'joi';

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Blog comments management
 * 
 * tags:
 *   name: Likes
 *   description: Blog likes management
 */

const commentLikeRouter = Router();
const controller = new CommentLikeController();

/**
 * @swagger
 * components:
 *   schemas:
 *     CommentInput:
 *       type: object
 *       required:
 *         - content
 *         - blogId
 *       properties:
 *         content:
 *           type: string
 *           description: The content of the comment
 *         blogId:
 *           type: string
 *           format: uuid
 *           description: The ID of the blog to comment on
 * 
 * /api/v1/comments:
 *   post:
 *     summary: Add a comment to a blog
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentInput'
 *     responses:
 *       201:
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Comment created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Comment'
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 * 
 * /api/v1/blogs/{blogId}/comments:
 *   get:
 *     summary: Get all comments for a blog
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of comments
 *       404:
 *         description: Blog not found
 * 
 * /api/v1/blogs/{blogId}/like:
 *   post:
 *     summary: Toggle like/unlike a blog
 *     description: Toggle like status for a blog. If the user has already liked the blog, it will unlike it, and vice versa.
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the blog to like/unlike
 *     responses:
 *       200:
 *         description: Like status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     userId:
 *                       type: string
 *                       format: uuid
 *                     blogId:
 *                       type: string
 *                       format: uuid
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *             examples:
 *               liked:
 *                 value:
 *                   success: true
 *                   message: Blog liked successfully
 *                   data: {
 *                     id: "123e4567-e89b-12d3-a456-426614174000",
 *                     userId: "123e4567-e89b-12d3-a456-426614174001",
 *                     blogId: "123e4567-e89b-12d3-a456-426614174002",
 *                     createdAt: "2023-08-17T12:00:00Z",
 *                     updatedAt: "2023-08-17T12:00:00Z"
 *                   }
 *               unliked:
 *                 value:
 *                   success: true
 *                   message: Blog unliked successfully
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Authentication required
 *       404:
 *         description: Blog not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Blog not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *         schema:
 *           type: string
 *           format: uuid
 *
 * /api/v1/blogs/{blogId}/likes:
 *   get:
 *     summary: Get likes count for a blog
 *     description: Get the total number of likes for a specific blog
 *     tags: [Likes]
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the blog to get likes count for
 *     responses:
 *       200:
 *         description: Successfully retrieved likes count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       example: 42
 *       404:
 *         description: Blog not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Blog not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 * 
 * /api/v1/blogs/{blogId}/likes:
 *   get:
 *     summary: Get likes count and status for a blog
 *     tags: [Likes]
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Like information retrieved successfully
 *       404:
 *         description: Blog not found
 */


const CommentSchema = Joi.object({
    content: Joi.string().required(),
    blogId: Joi.string().uuid().required()
});


commentLikeRouter.post('/comments',
    authMiddleware,
    ValidationMiddleware({ type: 'body', schema: CommentSchema }),
    controller.createComment.bind(controller)
);

commentLikeRouter.get('/blogs/:blogId/comments',
    controller.getBlogComments.bind(controller)
);

// Likes routes
commentLikeRouter.post('/blogs/:blogId/like',
    authMiddleware,
    controller.toggleLike.bind(controller)
);

commentLikeRouter.get('/blogs/:blogId/likes',
    controller.getBlogLikes.bind(controller)
);

export { commentLikeRouter };
