import {
  type JobContext,
  WorkerOptions,
  cli,
  defineAgent,
  voice,
} from '@livekit/agents';
import * as openai from '@livekit/agents-plugin-openai';
import { BackgroundVoiceCancellation } from '@livekit/noise-cancellation-node';
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
      
      Always respond in a calm, soothing voice. Keep responses concise but helpful. 
      Ask follow-up questions to understand the user's needs better.
      If the user seems stressed or anxious, offer specific breathing exercises or meditation techniques.`,
    });
  }
}

export default defineAgent({
  entry: async (ctx: JobContext) => {
    const session = new voice.AgentSession({
      llm: new openai.realtime.RealtimeModel({
        voice: 'coral',
      }),
    });

    await session.start({
      agent: new Assistant(),
      room: ctx.room,
      inputOptions: {
        // For telephony applications, use `TelephonyBackgroundVoiceCancellation` for best results
        noiseCancellation: BackgroundVoiceCancellation(),
        closeOnDisconnect: false, // Keep session alive
      },
    });

    await ctx.connect();

    const handle = session.generateReply({
      instructions: `Greet the user warmly and introduce yourself as their meditation guide. 
      Ask them how they're feeling today and what kind of support they need. 
      Be encouraging and ready to help with meditation, breathing exercises, or emotional support.`,
    });
    await handle.waitForPlayout();
  },
});

cli.runApp(new WorkerOptions({ agent: fileURLToPath(import.meta.url) }));
