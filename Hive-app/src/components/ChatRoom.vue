<template>
    <div class="chat-container">
      <!-- Loop through sortedMessages -->
      <div
        v-for="(message, index) in sortedMessages"
        :key="index"
        :class="[
          'message-container',
          message.sender === currentUserId ? 'sent' : 'received'
        ]"
      >
        <!-- Bubble -->
        <div class="message">
          <p class="message-text">{{ message.text }}</p>
        </div>
        <!-- Timestamp below bubble (shown conditionally) -->
        <div class="message-time" v-if="shouldShowTimestamp(index)">
          {{ formatMessageTime(message.timestamp) }}
        </div>
      </div>
  
      <!-- Input area -->
      <div class="input-bar">
        <input 
          v-model="newMessage" 
          @keyup.enter="handleSendMessage" 
          placeholder="Type a message..."
        />
        <button @click="handleSendMessage">Send</button>
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
        localMessages: this.chat.messages ? [...this.chat.messages] : []
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
  flex: 1;
  display: flex;
  flex-direction: column;
  max-height: 100vh; /* or your preferred height */
  max-width: 60vw;  /* or your preferred width */
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  overflow-y: auto;
  margin: 10px;
}

/* Each message is in a full-width row that can justify content left or right */
.message-container {
  width: 100%;
  display: flex;
  flex-direction: column; /* so timestamp can appear under the bubble */
  margin-bottom: 12px;
}

/* Sent (currentUser) messages flush right */
.message-container.sent {
  align-items: flex-end;  /* bubble + timestamp on the right */
}

/* Received messages flush left */
.message-container.received {
  align-items: flex-start; /* bubble + timestamp on the left */
}

/* The bubble itself */
.message {
  max-width: 70%;          /* up to 70% of container */
  padding: 10px;
  border-radius: 12px;
  word-wrap: break-word;    /* handle long words */
  overflow-wrap: break-word;/* fallback for some browsers */
  white-space: pre-wrap;    /* preserve spacing/line breaks, but wrap */
}

/* Bubble colors */
.message-container.sent .message {
  background-color: #FEC20C; /* your "sent" color */
}

.message-container.received .message {
  background-color: #eee;    /* your "received" color */
}

/* Message text inside the bubble */
.message-text {
  margin: 0;
}

/* Timestamp below bubble */
.message-time {
  font-size: 0.6rem;
  color: #888;
  margin-top: 4px;
}

/* Input area at bottom */
.input-bar {
  display: flex;
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid #ccc;
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
  