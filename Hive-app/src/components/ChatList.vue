<template>
    <div class="chat-list-container">
      <h2 class="chat-list-title">Messages</h2>
  
      <!-- Search Bar -->
      <div class="chat-search-container">
        <input
          type="text"
          class="chat-search-input"
          placeholder="Search people or message"
          v-model="searchTerm"
        />
      </div>
  
      <!-- Chat List -->
      <ul class="chat-list">
        <li
          v-for="chat in filteredChats"
          :key="chat.id"
          class="chat-list-item"
          @click="handleChatSelected(chat)"
        >
          <img
            :src="chat.avatar"
            :alt="`${chat.name}'s avatar`"
            class="chat-avatar"
          />
          <div class="chat-details">
            <div class="chat-header">
              <span class="chat-name">{{ chat.name }}</span>
              <span class="chat-handle">{{ chat.handle }}</span>
            </div>
            <div class="chat-last-message">
              {{ getLatestMessage(chat).text }}
            </div>
          </div>
          <div class="chat-date">
            {{ formatTimestamp(getLatestMessage(chat).timestamp) }}
          </div>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: "ChatList",
    emits: ["chat-selected"],
    data() {
      return {
        searchTerm: "",
        chats: [
          {
            id: 1,
            name: "Suzana Colin",
            handle: "@suzana",
            avatar:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBoYc1e2gvFZ6xxMWimRLKyPxPrcmi5q7VhA&s",
            messages: [
              {
                id: 1,
                receiverUid: "1",
                senderUid: "2",
                text: "Hello, how are you?",
                timestamp: "2025-02-25T09:45:00"
              },
              {
                id: 2,
                receiverUid: "1",
                senderUid: "2",
                text: "Chris Martin reacted with :love",
                timestamp: "2025-02-25T10:55:00"
              }
            ]
          },
          {
            id: 2,
            name: "Christina Ker",
            handle: "@tinachris",
            avatar:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQapi5W3pywCFfPL4eKblSB5BI7VMtV0gPe4Q&s",
            messages: [
              {
                id: 3,
                receiverUid: "1",
                senderUid: "3",
                text: "Thank you for your great recommendations!",
                timestamp: "2025-02-25T10:10:00"
              }
            ]
          },
          {
            id: 3,
            name: "Charles May",
            handle: "@maythe",
            avatar:
              "https://sabimages.com/wp-content/uploads/2024/07/cute-girl-pic-dp1.jpg",
            messages: [
              {
                id: 4,
                receiverUid: "1",
                senderUid: "4",
                text: "Chris Martin reacted with :love",
                timestamp: "2025-02-25T10:20:00"
              }
            ]
          },
          {
            id: 4,
            name: "John Hope",
            handle: "@hopj_ohn",
            avatar:
              "https://images.unsplash.com/photo-1507019403270-cca502add9f8?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z2lybCUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
            messages: [
              {
                id: 5,
                receiverUid: "1",
                senderUid: "5",
                text: "I just said, we may have a good couple.",
                timestamp: "2025-02-25T10:25:00"
              }
            ]
          },
          {
            id: 5,
            name: "Michael Hopkins",
            handle: "@hopkins",
            avatar:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROsqQ_h_eGWSjZPlD4l_06G3vy_vvihA1IXg&s",
            messages: [
              {
                id: 6,
                receiverUid: "1",
                senderUid: "6",
                text: "Chris Martin reacted with :love",
                timestamp: "2025-02-23T10:30:00"
              }
            ]
          }
        ]
      };
    },
    computed: {
      filteredChats() {
        const lowerSearch = this.searchTerm.toLowerCase();
        const filtered = this.chats.filter((chat) => {
          const latestMessage = this.getLatestMessage(chat);
          return (
            chat.name.toLowerCase().includes(lowerSearch) ||
            chat.handle.toLowerCase().includes(lowerSearch) ||
            latestMessage.text.toLowerCase().includes(lowerSearch)
          );
        });
        return filtered.sort((a, b) => {
          const timeA = new Date(this.getLatestMessage(a).timestamp);
          const timeB = new Date(this.getLatestMessage(b).timestamp);
          return timeB - timeA;
        });
      }
    },
    methods: {
      getLatestMessage(chat) {
        if (!chat.messages || chat.messages.length === 0) {
          return { text: "", timestamp: "" };
        }
        return chat.messages.reduce((latest, message) => {
          return new Date(message.timestamp) > new Date(latest.timestamp)
            ? message
            : latest;
        });
      },
      formatTimestamp(timestamp) {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        const now = new Date();
  
        if (
          date.getFullYear() === now.getFullYear() &&
          date.getMonth() === now.getMonth() &&
          date.getDate() === now.getDate()
        ) {
          let hours = date.getHours();
          let minutes = date.getMinutes();
          const period = hours >= 12 ? "pm" : "am";
          hours = hours % 12;
          if (hours === 0) hours = 12;
          minutes = minutes < 10 ? "0" + minutes : minutes;
          return `${hours}.${minutes}${period}`;
        } else if (date.getFullYear() === now.getFullYear()) {
          const day = date.getDate();
          const monthNames = [
            "jan",
            "feb",
            "mar",
            "apr",
            "may",
            "jun",
            "jul",
            "aug",
            "sep",
            "oct",
            "nov",
            "dec"
          ];
          const month = monthNames[date.getMonth()];
          return `${day} ${month}`;
        } else {
          let day = date.getDate();
          let month = date.getMonth() + 1;
          let year = date.getFullYear() % 100;
          day = day < 10 ? "0" + day : day;
          month = month < 10 ? "0" + month : month;
          year = year < 10 ? "0" + year : year;
          return `${day}/${month}/${year}`;
        }
      },
      handleChatSelected(chat) {
        // Emit the selected chat's data to the parent component
        this.$emit("chat-selected", chat);
      }
    }
  };
  </script>
  

<style scoped>
/* Ensure box-sizing is set to border-box for more predictable layouts */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* Responsive container: full width with a max-width on larger screens */
.chat-list-container {
  width: 100%;
  max-width: 480px;
  background-color: #ffcc00;
  padding: 1rem;
  margin: 0 auto;
  border-radius: 8px;
  font-family: sans-serif;
}

.chat-list-title {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  color: #000;
}

.chat-search-container {
  margin-bottom: 1rem;
}

.chat-search-input {
  width: 100%;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
}

.chat-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.chat-list-item {
  display: flex;
  align-items: center;
  background-color: transparent;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.chat-list-item:hover {
  background-color: #f2f2f2;
}

.chat-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 0.75rem;
  object-fit: cover;
}

.chat-details {
  flex: 1;
}

.chat-header {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.chat-name {
  font-weight: bold;
  font-size: 1rem;
}

.chat-handle {
  font-size: 0.875rem;
  color: #666;
}

.chat-last-message {
  font-size: 0.9rem;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.chat-date {
  font-size: 0.75rem;
  color: black;
  margin-left: 0.5rem;
}

/* Optional media query for smaller screens */
@media (max-width: 400px) {
  .chat-list-container {
    padding: 0.5rem;
  }

  .chat-list-item {
    padding: 0.5rem 0.25rem;
  }

  .chat-avatar {
    width: 40px;
    height: 40px;
    margin-right: 0.5rem;
  }

  .chat-name {
    font-size: 0.95rem;
  }

  .chat-handle {
    font-size: 0.8rem;
  }

  .chat-last-message {
    font-size: 0.8rem;
    max-width: 120px;
  }

  .chat-date {
    font-size: 0.7rem;
  }
}
</style>