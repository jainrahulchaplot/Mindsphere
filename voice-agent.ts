import {
  type JobContext,
  WorkerOptions,
  cli,
  defineAgent,
  voice,
} from '@livekit/agents';
import * as openai from '@livekit/agents-plugin-openai';
import { BackgroundVoiceCancellation } from '@livekit/noise-cancellation-node';
import { RoomServiceClient } from 'livekit-server-sdk';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

class Assistant extends voice.Agent {
  constructor() {
    super({
      instructions: `You are a helpful voice AI assistant for MindSphere meditation app. 
      
      Your role:
      - Provide meditation guidance and mindfulness tips
      - Offer emotional support and encouragement
      - Guide users through breathing exercises
      - Help with stress relief and relaxation techniques
      
      Conversation style:
      - Always respond in a calm, soothing voice
      - Keep responses concise (1-2 sentences) for better realtime flow
      - Use natural pauses and breathing in your speech
      - Ask follow-up questions to understand the user's needs
      - If the user seems stressed, offer specific breathing exercises
      - Be empathetic and supportive in your tone
      - Always respond in English only`,
    });
  }
}

export default defineAgent({
  entry: async (ctx: JobContext) => {
    // Using OpenAI Realtime API for better emotional context understanding
    // and expressive speech output - perfect for meditation guidance
    const session = new voice.AgentSession({
      llm: new openai.realtime.RealtimeModel({
        voice: 'coral',
        // Optimize for meditation app use case
        temperature: 0.7, // Slightly more creative for meditation guidance
        // Use faster model for better realtime performance
        model: 'gpt-4o-realtime-preview-2024-10-01',
      }),
    });

    await session.start({
      agent: new Assistant(),
      room: ctx.room,
      inputOptions: {
        // For telephony applications, use `TelephonyBackgroundVoiceCancellation` for best results
        noiseCancellation: BackgroundVoiceCancellation(),
        closeOnDisconnect: false, // Keep session alive
        // VAD is handled automatically by the realtime model
      },
    });

    await ctx.connect();

    const handle = session.generateReply({
      instructions: `Greet the user warmly in English and introduce yourself as their meditation guide. 
      Keep your greeting brief and natural. Ask them how they're feeling today in a caring tone.
      Be ready to help with meditation, breathing exercises, or emotional support.
      Always respond in English only and keep responses conversational and concise.`,
    });
    await handle.waitForPlayout();

    // Set up room deletion when session should end
    const roomServiceClient = new RoomServiceClient(
      process.env.LIVEKIT_URL!,
      process.env.LIVEKIT_API_KEY!,
      process.env.LIVEKIT_API_SECRET!
    );

    // Listen for room events to handle cleanup
    ctx.room.on('participantDisconnected', async (participant) => {
      console.log('Participant disconnected:', participant.identity);
      
      // If it's a user (not agent) and they disconnect, end the room
      if (!participant.identity.includes('agent') && !participant.identity.includes('assistant')) {
        console.log('User disconnected, ending room session');
        try {
          await roomServiceClient.deleteRoom(ctx.room.name);
          console.log('Room deleted successfully:', ctx.room.name);
        } catch (error) {
          console.error('Failed to delete room:', error);
        }
      }
    });

    // Handle agent disconnect as well
    ctx.room.on('participantDisconnected', async (participant) => {
      if (participant.identity.includes('agent') || participant.identity.includes('assistant')) {
        console.log('Agent disconnected, ending room session');
        try {
          await roomServiceClient.deleteRoom(ctx.room.name);
          console.log('Room deleted successfully:', ctx.room.name);
        } catch (error) {
          console.error('Failed to delete room:', error);
        }
      }
    });
  },
});

cli.runApp(new WorkerOptions({ agent: fileURLToPath(import.meta.url) }));
