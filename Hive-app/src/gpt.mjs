import OpenAI from "openai";
import { db } from "@/firebase"; // Import Firestore
import { doc, getDoc } from "firebase/firestore";
const openai = new OpenAI({ apiKey: "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", dangerouslyAllowBrowser: true });

export async function getChatPrompts(chatId, currentUserId) {
  try {
    // Fetch chat data from Firestore
    const chatRef = doc(db, "matches", chatId);
    const chatSnap = await getDoc(chatRef);

    if (!chatSnap.exists()) {
      console.error("Chat document not found");
      return [];
    }

    const chatData = chatSnap.data();
    const messages = chatData.messages || [];
    
    // Get IDs of both users in the chat
    const userIds = chatData.userIds || [];
    if (!userIds.includes(currentUserId) || userIds.length !== 2) {
      console.error("Invalid chat user data");
      return [];
    }

    // Identify the other user in the chat
    const otherUserId = userIds.find(id => id !== currentUserId);
    
    // Fetch other user's profile to get their interests
    const otherUserRef = doc(db, "users", otherUserId);
    const otherUserSnap = await getDoc(otherUserRef);
    
    if (!otherUserSnap.exists()) {
      console.error("Other user profile not found");
      return [];
    }
    
    const otherUserData = otherUserSnap.data();
    const otherUserInterests = otherUserData.interests || [];
    const otherUserName = otherUserData.firstName || "the other person";
    
    // Also get current user's interests for better context
    const currentUserRef = doc(db, "users", currentUserId);
    const currentUserSnap = await getDoc(currentUserRef);
    let currentUserInterests = [];
    
    if (currentUserSnap.exists()) {
      currentUserInterests = currentUserSnap.data().interests || [];
    }
    
    // Find common interests
    const commonInterests = otherUserInterests.filter(interest => 
      currentUserInterests.includes(interest)
    );
    
    let systemPrompt, userPrompt;
    
    // Build interest context string
    const interestContext = buildInterestContext(otherUserName, otherUserInterests, commonInterests);

    if (messages.length === 0) {
      // If no previous messages, generate interest-based conversation starters
      systemPrompt = "You are a conversation starter generator for a dating/social app. Your suggestions should be friendly, engaging, and natural.";
      userPrompt = `${interestContext} Provide 5 very short conversation starter suggestions that reference their interests in a subtle, natural way. Keep suggestions diverse. Return only the suggestions, each on a separate line, with no numbering, bullet points, or extra text.`;
    } else {
      // Get the last few messages for context (up to 5)
      const recentMessages = messages.slice(-5).map(msg => {
        const sender = msg.sender === currentUserId ? "You" : otherUserName;
        return `${sender}: ${msg.text}`;
      });
      
      const conversationContext = recentMessages.join("\n");
      
      // Check who sent the last message
      const lastMessage = messages[messages.length - 1];
      
      if (lastMessage.sender === currentUserId) {
        // If current user sent the last message, suggest follow-ups to their own message
        systemPrompt = "You are a chat assistant for a dating/social app, helping users maintain engaging conversations.";
        userPrompt = `${interestContext}
          Recent conversation:
          ${conversationContext}
          The user (You) sent the last message. Suggest 5 different follow-up messages they could send next to keep the conversation flowing naturally. Reference their shared interests subtly if relevant. Keep suggestions brief and conversational. Return only the suggestions, each on a separate line, with no numbering, bullet points, or extra text.`;
      } else {
        // If other user sent the last message, suggest replies
        systemPrompt = "You are a chat assistant for a dating/social app, helping users respond engagingly.";
        userPrompt = `${interestContext}
          Recent conversation:
          ${conversationContext}
          The other person sent the last message. Suggest 5 different ways to reply that keep the conversation flowing naturally. Reference their interests subtly if relevant. Keep suggestions brief and conversational. Return only the suggestions, each on a separate line, with no numbering, bullet points, or extra text.`;
      }
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.8,
      store: true,
    });

    const responseText = completion.choices[0].message.content;
    return responseText.split("\n").filter(line => line.trim() !== "");
    
  } catch (error) {
    console.error("Error fetching chat prompts:", error);
    return [];
  }
}

// Helper function to build context about the other user's interests
function buildInterestContext(userName, interests, commonInterests) {
  if (!interests || interests.length === 0) {
    return `${userName} hasn't shared any specific interests.`;
  }
  
  let context = `${userName}'s interests include: ${interests.join(', ')}.`;
  
  if (commonInterests && commonInterests.length > 0) {
    context += ` You both share interests in: ${commonInterests.join(', ')}.`;
  }
  
  return context;
}