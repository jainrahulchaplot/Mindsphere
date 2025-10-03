import { AccessToken, type AccessTokenOptions, type VideoGrant } from 'livekit-server-sdk';

const API_KEY = 'APIb8zqSRy4wpfd';
const API_SECRET = 'hGwWNh1HSphPBWOAukRw6z7g5idUJUNNWPLIKzdQK9J';
const LIVEKIT_URL = 'wss://mindsphere-1613vohm.livekit.cloud';

export type ConnectionDetails = {
  serverUrl: string;
  roomName: string;
  participantName: string;
  participantToken: string;
};

export async function createParticipantToken(
  userInfo: AccessTokenOptions,
  roomName: string,
  agentName?: string
): Promise<string> {
  const at = new AccessToken(API_KEY, API_SECRET, {
    ...userInfo,
    ttl: '15m',
  });
  const grant: VideoGrant = {
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
  };
  at.addGrant(grant);

  return at.toJwt();
}

export async function getConnectionDetails(): Promise<ConnectionDetails> {
  const participantName = 'user';
  const participantIdentity = `voice_assistant_user_${Math.floor(Math.random() * 10_000)}`;
  const roomName = `voice_assistant_room_${Math.floor(Math.random() * 10_000)}`;

  const participantToken = await createParticipantToken(
    { identity: participantIdentity, name: participantName },
    roomName
  );

  return {
    serverUrl: LIVEKIT_URL,
    roomName,
    participantToken: participantToken,
    participantName,
  };
}
