import { Hono } from 'hono';
import * as agentController from '../controllers/agent.controller.js';

const agentRoutes = new Hono();

agentRoutes.get('/', agentController.listAgents);
agentRoutes.get('/:type/capabilities', agentController.getAgentCapabilities);

export default agentRoutes;
