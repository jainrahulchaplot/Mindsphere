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

// Function to fetch user context from backend using existing vector DB service
async function fetchUserContext(userId: string): Promise<string> {
  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/api/voice/context/${userId}`);
    
    if (!response.ok) {
      console.error('Failed to fetch user context:', response.status);
      return '';
    }
    
    const context = await response.json();
    console.log(`🧠 Fetched user context: ${context.memories.length} memories, ${context.snippets.length} snippets`);
    
    // Format the context using the same logic as the existing system
    let contextText = '';
    
    if (context.memories && context.memories.length > 0) {
      contextText += '\n\nLONG-TERM MEMORY CONTEXT:\n';
      context.memories.forEach((memory: any, index: number) => {
        contextText += `${index + 1}. [${memory.category}] ${memory.content}\n`;
      });
    }
    
    if (context.snippets && context.snippets.length > 0) {
      contextText += '\n\nRECENT THOUGHTS & INSIGHTS:\n';
      context.snippets.forEach((snippet: any, index: number) => {
        contextText += `${index + 1}. ${snippet.content}\n`;
      });
    }
    
    if (context.preferences) {
      const prefs = context.preferences;
      if (prefs.personal_goals && prefs.personal_goals.length > 0) {
        contextText += `\n\nPERSONAL GOALS: ${prefs.personal_goals.join(', ')}\n`;
      }
      if (prefs.meditation_goals && prefs.meditation_goals.length > 0) {
        contextText += `MEDITATION GOALS: ${prefs.meditation_goals.join(', ')}\n`;
      }
      if (prefs.sleep_preferences && prefs.sleep_preferences.length > 0) {
        contextText += `SLEEP PREFERENCES: ${prefs.sleep_preferences.join(', ')}\n`;
      }
      if (prefs.preferred_content_themes && prefs.preferred_content_themes.length > 0) {
        contextText += `PREFERRED THEMES: ${prefs.preferred_content_themes.join(', ')}\n`;
      }
    }
    
    return contextText;
  } catch (error) {
    console.error('Error fetching user context:', error);
    return '';
  }
}

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
    // Extract user ID from room name or participant identity
    const roomName = ctx.room.name;
    let userId: string | null = null;
    
    // Try to extract user ID from room name (format: meditation_room_XXXXX or meditation_room_user_123)
    if (roomName) {
      const match = roomName.match(/meditation_room_(.+)/);
      if (match) {
        userId = match[1];
      }
    }
    
    // If no user ID found, use demo user for development
    if (!userId) {
      userId = '550e8400-e29b-41d4-a716-446655440000'; // Demo user ID
      console.log('No user ID found in room name, using demo user');
    }
    
    console.log(`🧠 Voice agent starting for user: ${userId}`);

    // Fetch user context from backend using existing vector DB service
    const userContextText = await fetchUserContext(userId);
    
    // Create assistant
    const assistant = new Assistant();
    
    if (userContextText) {
      console.log(`🧠 Assistant loaded with user context: ${userContextText.length} characters`);
    } else {
      console.log('🧠 No user context available, using default instructions');
    }

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
      agent: assistant,
      room: ctx.room,
      inputOptions: {
        // For telephony applications, use `TelephonyBackgroundVoiceCancellation` for best results
        noiseCancellation: BackgroundVoiceCancellation(),
        closeOnDisconnect: false, // Keep session alive
        // VAD is handled automatically by the realtime model
      },
    });

    await ctx.connect();

    // Create personalized greeting based on user context
    let greetingInstructions = `Greet the user warmly in English and introduce yourself as their meditation guide. 
    Keep your greeting brief and natural. Ask them how they're feeling today in a caring tone.
    Be ready to help with meditation, breathing exercises, or emotional support.
    Always respond in English only and keep responses conversational and concise.`;
    
    if (userContextText) {
      greetingInstructions += `\n\nPERSONALIZATION REQUIREMENTS (CRITICAL):
      - ALWAYS incorporate the user's long-term memories and recent thoughts provided below
      - Reference specific details from their memories (objects, experiences, relationships, goals)
      - Use their recent thoughts and insights to shape the conversation's themes and guidance
      - Make the conversation deeply personal and relevant to their life experiences
      - Integrate their professional context, personal goals, and emotional state naturally
      - The conversation should feel like it was created specifically for this person based on their unique life
      
      ${userContextText}`;
    }

    const handle = session.generateReply({
      instructions: greetingInstructions,
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
      
      const roomName = ctx.room.name;
      if (!roomName) {
        console.error('Room name is undefined, cannot delete room');
        return;
      }
      
      // If it's a user (not agent) and they disconnect, end the room
      if (!participant.identity.includes('agent') && !participant.identity.includes('assistant')) {
        console.log('User disconnected, ending room session');
        try {
          await roomServiceClient.deleteRoom(roomName);
          console.log('Room deleted successfully:', roomName);
        } catch (error) {
          console.error('Failed to delete room:', error);
        }
      }
    });

    // Handle agent disconnect as well
    ctx.room.on('participantDisconnected', async (participant) => {
      const roomName = ctx.room.name;
      if (!roomName) {
        console.error('Room name is undefined, cannot delete room');
        return;
      }
      
      if (participant.identity.includes('agent') || participant.identity.includes('assistant')) {
        console.log('Agent disconnected, ending room session');
        try {
          await roomServiceClient.deleteRoom(roomName);
          console.log('Room deleted successfully:', roomName);
        } catch (error) {
          console.error('Failed to delete room:', error);
        }
      }
    });
  },
});

cli.runApp(new WorkerOptions({ agent: fileURLToPath(import.meta.url) }));
