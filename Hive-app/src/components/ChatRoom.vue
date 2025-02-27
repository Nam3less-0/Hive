<template>
  <div class="chat-container">
    <!-- Scrollable messages container -->
    <div class="messages-container">
      <div
        v-for="(message, index) in sortedMessages"
        :key="index"
        :class="[
          'message-container',
          message.sender === currentUserId ? 'sent' : 'received'
        ]"
      >
        <!-- Message bubble -->
        <div class="message">
          <p class="message-text">{{ message.text }}</p>
        </div>
        <!-- Timestamp below bubble (shown conditionally) -->
        <div class="message-time" v-if="shouldShowTimestamp(index)">
          {{ formatMessageTime(message.timestamp) }}
        </div>
      </div>
    </div>

    <!-- Input section fixed to bottom -->
    <div class="input-section">
      <div class="chat-prompter">
        <button class="prompter-toggle" @click="togglePrompter">
          Conversation Starters
          <span v-if="showPrompter">▲</span>
          <span v-else>▼</span>
        </button>
        <div class="prompter-suggestions" v-if="showPrompter">
          <div
            class="chat-prompt"
            v-for="(prompt, index) in chatPrompts"
            :key="index"
            @click="selectChatPrompt(prompt)"
          >
            {{ prompt }}
          </div>
        </div>
      </div>

      <div class="input-bar">
        <input 
          v-model="newMessage" 
          @keyup.enter="handleSendMessage" 
          placeholder="Type a message..."
        />
        <button @click="handleSendMessage">Send</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChatRoom",
  props: {
    chat: {
      type: Object,
      required: true,
    },
    currentUserId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      newMessage: "",
      // Local copy of messages for immediate rendering
      localMessages: this.chat.messages ? [...this.chat.messages] : [],
      // Chat prompter suggestions
      chatPrompts: [],
      // Toggle state for the chat prompter
      showPrompter: false,
    };
  },
  computed: {
    sortedMessages() {
      if (!this.localMessages) return [];
      return this.localMessages.slice().sort((a, b) => {
        return new Date(a.timestamp) - new Date(b.timestamp);
      });
    },
  },
  methods: {
    handleSendMessage() {
      if (this.newMessage.trim()) {
        const message = {
          text: this.newMessage,
          sender: this.currentUserId,
          timestamp: new Date().toISOString(),
        };
        this.localMessages.push(message);
        this.$emit("send-message", message);
        this.newMessage = "";
      }
    },
    formatMessageTime(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
    shouldShowTimestamp(index) {
      const messages = this.sortedMessages;
      if (index === messages.length - 1) return true;
      const currentTime = new Date(messages[index].timestamp);
      const nextTime = new Date(messages[index + 1].timestamp);
      const diffMinutes = (nextTime - currentTime) / 60000;
      return diffMinutes > 5;
    },
    fetchChatPrompts() {
      // Simulate calling ChatGPT for suggestions.
      // In a real scenario, replace this with an API call.
      this.chatPrompts = [
        "How has your day been so far?",
        "What did you do over the weekend?",
        "Have you read any good books lately?",
        "What kind of music are you into?",
        "Do you have any hobbies you're passionate about?"
      ];
    },
    togglePrompter() {
      this.showPrompter = !this.showPrompter;
      if (this.showPrompter && this.chatPrompts.length === 0) {
        this.fetchChatPrompts();
      }
    },
    selectChatPrompt(prompt) {
      this.newMessage = prompt;
    }
  },
  watch: {
    'chat.messages': {
      handler(newVal) {
        this.localMessages = newVal ? [...newVal] : [];
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style scoped>
.chat-container {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh; /* or adjust as needed */
  max-width: 60vw;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin: 10px;
}

/* Messages container scrolls and leaves space at bottom */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 100px; /* Adjust to match input-section height */
}

.message-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}

.message-container.sent {
  align-items: flex-end;
}

.message-container.received {
  align-items: flex-start;
}

.message {
  max-width: 70%;
  padding: 10px;
  border-radius: 12px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
}

.message-container.sent .message {
  background-color: #FEC20C;
}

.message-container.received .message {
  background-color: #eee;
}

.message-text {
  margin: 0;
}

.message-time {
  font-size: 0.6rem;
  color: #888;
  margin-top: 4px;
}

/* Input section fixed to bottom using sticky */
.input-section {
  position: sticky;
  bottom: 0;
  background-color: #fff;
  z-index: 10;
  padding: 4px 10px;
  border-top: 1px solid #ccc;
}

/* Chat Prompter */
.chat-prompter {
  margin-bottom: 4px;
}

.prompter-toggle {
  background-color: #17a2b8;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.prompter-toggle:hover {
  background-color: #138496;
}

.prompter-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}

.chat-prompt {
  background-color: #e2e6ea;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.chat-prompt:hover {
  background-color: #d6dadf;
}

/* Input area */
.input-bar {
  display: flex;
  padding-top: 10px;
  background-color: #fff;
}

.input-bar input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.input-bar button {
  margin-left: 5px;
  padding: 8px 12px;
  border: none;
  background-color: #007bff;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
}

.input-bar button:hover {
  background-color: #0056b3;
}
</style>
