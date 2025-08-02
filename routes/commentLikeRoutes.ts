import { Router } from 'express';
import { ValidationMiddleware } from '../middlewares/validationMiddleware';
import { CommentLikeController } from '../controller/CommentLikeController';
import { authMiddleware } from '../middlewares/authMiddleware';
import Joi from 'joi';

const commentLikeRouter = Router();
const controller = new CommentLikeController();


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
