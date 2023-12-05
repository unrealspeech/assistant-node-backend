import { UnrealSpeechAPI } from "unrealspeech";
import dotenv from "dotenv";

dotenv.config();

const unrealSpeech = new UnrealSpeechAPI(process.env.UNREAL_SPEECH_API_KEY);

export const streamAPI = async (content, voiceId) => {
  const bitrate = "192k";
  const audioBuffer = await unrealSpeech.speech(content, voiceId, bitrate);
  return audioBuffer;
};
