import { Router } from 'express';
import { ValidationMiddleware } from '../middlewares/validationMiddleware';
import { CreateBlogSchema, UpdateBlogSchema } from '../schema/blogSchema';
import { BlogController } from '../controller/blogController';
import { authMiddleware } from '../middlewares/authMiddleware';

/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: Blog management endpoints
 */

const blogRouter = Router();
const controller = new BlogController();

/**
 * @swagger
 * /api/v1/blogs:
 *   post:
 *     summary: Create a new blog (Admin only)
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - slug
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               content:
 *                 type: string
 *               description:
 *                 type: string
 *               isPublished:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Blog created successfully
 *       403:
 *         description: Only admins can create blogs
 *       500:
 *         description: Server error
 *   get:
 *     summary: Get all published blogs
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: List of blogs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Blog'
 * 
 * /api/v1/blogs/{id}:
 *   get:
 *     summary: Get a blog by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Blog details retrieved successfully
 *       404:
 *         description: Blog not found
 * 
 *   put:
 *     summary: Update a blog (Admin only)
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               description:
 *                 type: string
 *               isPublished:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *       403:
 *         description: Only admins can update blogs
 *       404:
 *         description: Blog not found
 * 
 *   delete:
 *     summary: Delete a blog (Admin only)
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 *       403:
 *         description: Only admins can delete blogs
 *       404:
 *         description: Blog not found
 */

blogRouter.post('/blogs', 
    authMiddleware,
    ValidationMiddleware({ type: 'body', schema: CreateBlogSchema }), 
    controller.createBlog.bind(controller)
);

blogRouter.get('/blogs', controller.getAllBlogs.bind(controller));
blogRouter.get('/blogs/:id', controller.getBlogById.bind(controller));

blogRouter.put('/blogs/:id',
    authMiddleware,
    ValidationMiddleware({ type: 'body', schema: UpdateBlogSchema }),
    controller.updateBlog.bind(controller)
);

blogRouter.delete('/blogs/:id', 
    authMiddleware,
    controller.deleteBlog.bind(controller)
);

export { blogRouter };
