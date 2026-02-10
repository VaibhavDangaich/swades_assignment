import * as agentService from '../services/agent.service.js';

export function listAgents(c) {
    const agents = agentService.listAgents();
    return c.json({ success: true, data: agents });
}

export function getAgentCapabilities(c) {
    const { type } = c.req.param();

    const capabilities = agentService.getAgentCapabilities(type);
    if (!capabilities) {
        return c.json({ success: false, error: 'Agent not found' }, 404);
    }

    return c.json({ success: true, data: capabilities });
}
