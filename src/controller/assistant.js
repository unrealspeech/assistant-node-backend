import OpenAI from "openai";
import { streamAPI } from "../helper/unrealspeech.js";
const openai = new OpenAI();

async function createAssistant(req, res) {
  const { name, voiceId, question } = req.body;
  try {
    const assistant = await openai.beta.assistants.create({
      name: "Assistant",
      instructions:
        "You are a personal assistant, always ensure answers are very concise and short, also avoid returning asterics (*). Write and run code to answer user question",
      tools: [{ type: "code_interpreter" }],
      model: "gpt-4-1106-preview",
    });

    const thread = await openai.beta.threads.create();
    const message = await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: question,
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
      instructions: `Please address the user as ${name}. The user has a premium account.`,
    });

    const checkStatusAndPrintMessage = async (threadId, runId) => {
      let runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);

      if (runStatus.status === "completed") {
        const messages = await openai.beta.threads.messages.list(threadId);
        const result = messages.data
          .filter((message) => message.role === "assistant")
          //@ts-ignore
          .map((message) => message.content[0].text.value);
        console.log(result[0]);
        const audioData = await streamAPI(result[0], voiceId);
        res.json({ uri: audioData.OutputUri });
      } else {
        console.log("Awaiting assistant");
        setTimeout(() => checkStatusAndPrintMessage(threadId, runId), 1000);
      }
    };

    checkStatusAndPrintMessage(thread.id, run.id);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export { createAssistant };
