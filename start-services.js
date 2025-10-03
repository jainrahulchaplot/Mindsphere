import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting MindSphere services...');

// Start backend server
const backend = spawn('node', ['src/index.js'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  env: { ...process.env }
});

// Start voice agent
const voiceAgent = spawn('npx', ['tsx', 'voice-agent.ts', 'start'], {
  cwd: __dirname,
  stdio: 'inherit',
  env: { ...process.env }
});

// Handle process cleanup
function cleanup() {
  console.log('🛑 Shutting down services...');
  backend.kill();
  voiceAgent.kill();
  process.exit(0);
}

process.on('SIGTERM', cleanup);
process.on('SIGINT', cleanup);

// Handle process exits
backend.on('exit', (code) => {
  console.log(`Backend exited with code ${code}`);
  if (code !== 0) {
    voiceAgent.kill();
    process.exit(code);
  }
});

voiceAgent.on('exit', (code) => {
  console.log(`Voice agent exited with code ${code}`);
  if (code !== 0) {
    backend.kill();
    process.exit(code);
  }
});

console.log('✅ Services started successfully');
