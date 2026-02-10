import { Hono } from 'hono';
import * as chatController from '../controllers/chat.controller.js';

const chatRoutes = new Hono();

chatRoutes.post('/messages', chatController.sendMessage);
chatRoutes.get('/conversations', chatController.getConversations);
chatRoutes.get('/conversations/:id', chatController.getConversation);
chatRoutes.delete('/conversations/:id', chatController.deleteConversation);

export default chatRoutes;
