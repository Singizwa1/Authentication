import { Router } from 'express';
import { ValidationMiddleware } from '../middlewares/validationMiddleware';
import { CreateBlogSchema, UpdateBlogSchema } from '../schema/blogSchema';
import { BlogController } from '../controller/blogController';
import { authMiddleware } from '../middlewares/authMiddleware';

const blogRouter = Router();
const controller = new BlogController();

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
