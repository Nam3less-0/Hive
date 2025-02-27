import OpenAI from "openai";
const openai = new OpenAI({ apiKey: "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", dangerouslyAllowBrowser: true });

export async function getChatPrompts() {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a conversation starter generator for a chat application."
      },
      {
        role: "user",
        content: "Provide 5 very short conversation starter suggestions for a chat app. Return only the suggestions, each on a separate line, with no numbering, bullet points, or extra text."
      }
    ],
    store: true,
  });
  
  const rawPrompts = completion.choices[0].message.content;
  return rawPrompts.split("\n").filter(line => line.trim() !== "");
}