import OpenAI from "openai";
import { db } from "@/firebase"; // Import Firestore
import { doc, getDoc } from "firebase/firestore";
const openai = new OpenAI({ apiKey: "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", dangerouslyAllowBrowser: true });

export async function getChatPrompts(chatId, currentUserId) {
  try {
    // Fetch chat messages from Firestore
    const chatRef = doc(db, "matches", chatId);
    const chatSnap = await getDoc(chatRef);

    let messages = [];
    if (chatSnap.exists() && chatSnap.data().messages) {
      messages = chatSnap.data().messages;
    }

    let systemPrompt, userPrompt;

    if (messages.length === 0) {
      // If no previous messages, generate pick-up lines
      systemPrompt = "You are a conversation starter generator for a chat app.";
      userPrompt = "Provide 5 very short conversation starter suggestions for a chat app. Return only the suggestions, each on a separate line, with no numbering, bullet points, or extra text.";
    } else {
      // If chat exists, use the last received message as a prompt
      const lastMessage = messages[messages.length - 1];

      if (lastMessage.sender === currentUserId) {
        return []; // If last message was sent by the current user, no need to generate a response
      }

      systemPrompt = "You are a chat assistant for a messaging app.";
      userPrompt = `Give 5 short suggestions to reply naturally to this message:
      "${lastMessage.text}" in a casual and engaging way. Keep it brief. Return only the suggestions, each on a separate line, with no numbering, bullet points, or extra text.`;
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      store: true,
    });

    const responseText = completion.choices[0].message.content;
    return responseText.split("\n").filter(line => line.trim() !== "");
    
  } catch (error) {
    console.error("Error fetching chat prompts:", error);
    return [];
  }
}