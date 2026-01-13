
import { RoomServiceClient, AgentDispatchClient } from 'livekit-server-sdk';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const LIVEKIT_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL;
const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;

if (!LIVEKIT_URL || !API_KEY || !API_SECRET) {
    console.error('Missing LiveKit credentials');
    process.exit(1);
}

async function verifyAgentOnly() {
    const roomName = `verify-agent-${Date.now()}`;
    const roomService = new RoomServiceClient(LIVEKIT_URL!, API_KEY, API_SECRET);
    const agentDispatch = new AgentDispatchClient(LIVEKIT_URL!, API_KEY!, API_SECRET!);

    try {
        console.log(`Creating room: ${roomName}`);
        await roomService.createRoom({ name: roomName, emptyTimeout: 60 }); // Keep room open for 60s

        console.log("Dispatching agent to room...");
        const dispatch = await agentDispatch.createDispatch(roomName, 'daily-event-insurance');
        console.log(`Dispatch ID: ${dispatch.id}`);

        console.log("Waiting for agent to join...");

        // Poll for participant
        const startTime = Date.now();
        while (Date.now() - startTime < 30000) {
            const participants = await roomService.listParticipants(roomName);
            const agent = participants.find(p => p.identity.startsWith('agent-') || p.identity === 'daily-event-insurance' || p.kind === 2); // Kind 2 is AGENT usually, or manually checking identity

            if (agent) {
                console.log(`SUCCESS: Agent joined! Identity: ${agent.identity}`);
                return;
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        throw new Error("Agent did not join within 30 seconds");

    } catch (error) {
        console.error('Verification Failed:', error);
        process.exit(1);
    } finally {
        // Clean up room if possible, or let it expire
        // await roomService.deleteRoom(roomName); 
    }
}

verifyAgentOnly();
