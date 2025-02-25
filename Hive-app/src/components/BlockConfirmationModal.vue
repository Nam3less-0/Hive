<template>
    <div class="modal-overlay" v-if="visible" @click.self="handleCancel">
      <div class="modal-container">
        <div class="modal-content">
          <p class="modal-message">
            Are you sure you want to block <strong>{{ username }}</strong>?
          </p>
        </div>
        <div class="modal-actions">
          <button class="confirm-button" @click="handleConfirm">Block</button>
          <button class="cancel-button" @click="handleCancel">Cancel</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "BlockConfirmationModal",
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      username: {
        type: String,
        default: "",
      },
    },
    methods: {
      handleConfirm() {
        this.$emit("confirm");
      },
      handleCancel() {
        this.$emit("cancel");
      },
    },
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal-container {
    background-color: #fff;
    border-radius: 8px;
    max-width: 400px;
    width: 90%;
    padding: 20px;
    text-align: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }
  
  .modal-content {
    margin-bottom: 20px;
  }
  
  .modal-message {
    font-size: 1rem;
    color: #333;
  }
  
  .modal-actions {
    display: flex;
    justify-content: space-around;
  }
  
  .confirm-button,
  .cancel-button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
  }
  
  .confirm-button {
    background-color: #28a745;
    color: #fff;
  }
  
  .cancel-button {
    background-color: #dc3545;
    color: #fff;
  }
  
  .confirm-button:hover {
    background-color: #218838;
  }
  
  .cancel-button:hover {
    background-color: #c82333;
  }
  </style>
  