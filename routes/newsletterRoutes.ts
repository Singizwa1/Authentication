import { Router } from 'express';
import { newsletterController } from '../controller/newsletterController';

const newsletterRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Newsletter
 *   description: Newsletter subscription management
 * 
 * components:
 *   schemas:
 *     SubscribeRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email address to subscribe
 */

/**
 * @swagger
 * /api/newsletter/subscribe:
 *   post:
 *     summary: Subscribe to newsletter
 *     tags: [Newsletter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubscribeRequest'
 *     responses:
 *       201:
 *         description: Successfully subscribed
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
 *                   example: Successfully subscribed to newsletter
 *       400:
 *         description: Invalid email format
 *       409:
 *         description: Already subscribed
 *       500:
 *         description: Server error
 */
newsletterRouter.post('/subscribe', newsletterController.subscribe.bind(newsletterController));

/**
 * @swagger
 * /api/newsletter/unsubscribe:
 *   get:
 *     summary: Unsubscribe from newsletter
 *     tags: [Newsletter]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Unsubscribe token
 *     responses:
 *       200:
 *         description: Successfully unsubscribed
 *       400:
 *         description: Invalid token
 *       404:
 *         description: Subscription not found
 *       500:
 *         description: Server error
 */
newsletterRouter.get('/unsubscribe', newsletterController.unsubscribe.bind(newsletterController));

export default newsletterRouter;
