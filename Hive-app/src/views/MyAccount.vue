<template>
    <div class="layout">
      <Sidebar />
  
      <main class="myaccount-content">
        <!-- Profile Picture Section -->
        <section class="content-container">
          <h2>Profile Picture</h2>
          <div class="profile-pic-section">
            <img src="data:image/jpeg;base64,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" alt="Main profile pic" class="main-pic"/>
            <div class="secondary-pics">
              <img src="data:image/jpeg;base64,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" alt="secondary"/>
              <img src="data:image/jpeg;base64,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" alt="secondary"/>
              <button class="add-btn">＋</button>
            </div>
          </div>
        </section>
  
        <!-- Description Section -->
        <section class="content-container">
          <h2>Description</h2>
          <div class="desc">
            Hey, I'm Santtosh! I'm a Business Analytics student who loves diving into data insights and basketball courts. I love trying new activities, playing piano, casually reading on the beach, and pushing my limits on adrenaline-pumping sports. But sometimes I also just chill and vibe. Clearly balancing life, that's a real passion!
            <br><br>
            Looking for someone to share adventures, whether it's out skiing, hiking, or just hanging out. I'm all about making the most of every moment. 👍
          </div>
        </section>
  
        <!-- Interests Section -->
        <section class="content-container">
          <h2>Interests</h2>
          <div class="interests-tags">
            <span>Journeys</span>
            <span>Snowboarding</span>
            <span>Design</span>
            <span>Cross stitch</span>
            <span>Foreign languages</span>
            <span>Watching horror movies</span>
            <span>Detectives</span>
            <span>Game of Thrones</span>
            <span>Evening walks</span>
            <button class="add-interest-btn">＋</button>
          </div>
        </section>
  
        <!-- About Me Section -->
        <section class="content-container">
          <h2>About Me</h2>
          <table class="about-me-table">
            <tr><td>Appearance:</td><td>188 cm, 91 kg, athletic build, brown hair and brown eyes</td></tr>
            <tr><td>Orientation:</td><td>Hetero</td></tr>
            <tr><td>Relationships:</td><td>Free</td></tr>
            <tr><td>Children:</td><td>No, and I'm looking without children</td></tr>
            <tr><td>Availability of a car:</td><td>There are</td></tr>
            <tr><td>Education:</td><td>Higher</td></tr>
            <tr><td>Smoking:</td><td>Against smoking</td></tr>
            <tr><td>Alcohol:</td><td>I don't drink, but I don't mind</td></tr>
            <tr><td>Knowledge of foreign languages:</td><td>Russian (native); English (initial)</td></tr>
            <tr><td>Pets:</td><td>Cat</td></tr>
          </table>
        </section>
  
        <!-- My Account Section -->
        <section class="content-container">
          <h2>My Account</h2>
          <div class="my-account-form">
            <div class="form-group">
              <label>First Name</label>
              <input type="text" placeholder="First Name"/>
            </div>
            <div class="form-group">
              <label>Last Name</label>
              <input type="text" placeholder="Last Name"/>
            </div>
            <div class="form-group">
              <label>Height</label>
              <input type="text" placeholder="Height"/>
            </div>
            <div class="form-group">
              <label>Date of Birth</label>
              <input type="date" placeholder="27/12/02"/>
            </div>
            <div class="form-group full-width">
              <label>School</label>
              <input type="text" placeholder="School"/>
            </div>
            <div class="form-group full-width">
              <label>Email</label>
              <input type="email" placeholder="Email"/>
            </div>
            <div class="form-group">
              <label>Religion</label>
              <input type="text" placeholder="Religion"/>
            </div>
            <div class="form-group">
              <label>Race</label>
              <input type="text" placeholder="Race"/>
            </div>
          </div>
        </section>
  
        <!-- Security Section -->
        <section class="content-container">
          <h2>Security</h2>
          <div class="security-form">
            <div class="form-group full-width">
              <label>Phone Number</label>
              <input type="text" placeholder="**** 6854"/>
            </div>
  
            <div class="button-group">
              <button class="reset-btn" @click="openResetPopup">Reset Password</button>
              <button class="delete-btn">Delete Account</button>
            </div>
          </div>
        </section>

        <!-- Combined Popup for Reset & Forgot Password -->
        <div class="modal-overlay" v-if="showResetPopup">
            <div class="reset-modal">
            <button class="close-btn" @click="closePopup">×</button>

            <!-- Reset Password View -->
            <div v-if="!isForgotPassword">
                <h2>Reset Password</h2>
                <div class="form-group-2">
                <label>Current Password</label>
                <input type="password" v-model="currentPassword" placeholder="Enter Current Password" class="centered-input-2" />
                </div>
                <div class="form-group-2">
                <label>New Password</label>
                <input type="password" v-model="newPassword" placeholder="Enter New Password" class="centered-input-2" />
                </div>
                <p class="forgot-password" @click="isForgotPassword = true">Forgot Password?</p>
                <button class="confirm-btn" @click="resetPassword">Confirm</button>
            </div>

            <!-- Forgot Password View -->
            <div v-if="isForgotPassword">
                <h2>Forgot Password?</h2>
                <p>Enter your email to receive a password reset link.</p>
                <div class="form-group-2">
                <input type="email" v-model="userEmail" placeholder="Enter your email" class="centered-input-2" />
                </div>
                <button class="confirm-btn" @click="forgotPassword">Send Reset Email</button>
                <p class="back-to-reset" @click="isForgotPassword = false">Back</p>
                </div>
            </div>
        </div>
        <!-- Save Profile Button -->
        <div class="save-btn-container">
          <button class="save-btn">Save Profile</button>
        </div>
      </main>
    </div>
  </template>
  
  
  <script setup>
    import { ref } from 'vue'
    import { auth } from '@/firebase'
    import { sendPasswordResetEmail } from 'firebase/auth'
    import Sidebar from '@/components/Sidebar.vue'

    const showResetPopup = ref(false) // ✅ FIXED: Now properly reactive
    const isForgotPassword = ref(false) // ✅ Tracks view changes
    const currentPassword = ref('')
    const newPassword = ref('')
    const userEmail = ref('')

    function openResetPopup() {
        console.log("Opening Reset Password Popup");  // ✅ Debugging step
        showResetPopup.value = true;
    }

    // ✅ Close Popup Correctly
    function closePopup() {
    showResetPopup.value = false;
    isForgotPassword.value = false; // Reset to Reset Password View
    }

    async function forgotPassword() {
    if (!userEmail.value) {
        alert("Please enter your email.");
        return;
    }

    try {
        await sendPasswordResetEmail(auth, userEmail.value);
        alert("Password reset email sent! Check your inbox.");
        closePopup(); // ✅ Close the popup after sending
    } catch (error) {
        console.error("Error sending reset email:", error);
        alert("Error: " + error.message);
    }
    }

    function resetPassword() {
    alert("Reset password functionality can be expanded with Firebase re-authentication.");
    }
    
  </script>
  
  <style scoped>
  .layout {
    display: flex;
    align-items: flex-start;
    padding: 20px;
    background-color: #fafafa;
    min-height: 100vh;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  .myaccount-content {
    flex-grow: 1;
    padding: 30px;
    margin: 30px;
    box-sizing: border-box;
  }
  
  .content-container {
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    padding: 20px;
    margin-bottom: 25px;
  }
  
  .main-pic {
    width: 200px;
    height: 200px;
    border-radius: 10px;
  }
  
  .secondary-pics img {
    width: 100px;
    height: 100px;
    border-radius: 6px;
  }
  
  .interests-tags span, .desc {
    background: #f6f6f6;
    padding: 10px;
    border-radius: 6px;
    margin: 10px;
  }
  
  .about-me-table td {
    padding: 10px;
    border-bottom: 1px solid #eee;
  }
  
.my-account-form, .security-form {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
}

.form-group {
  display: flex;
  flex-direction: column;
  width: calc(50% - 10px);

}

/* Centering Input Text */
.centered-input-2 {
  text-align: center; /* Centers text inside the input field */
  width: 90%; /* Increases width */
  height: 10px; /* Increases height */
  font-size: 1.2rem; /* Makes text inside larger */
  padding: 10px; /* Adds padding for better spacing */
  border-radius: 8px; /* Rounds the edges slightly */
  border: 2px solid #d69e2e; /* Adds a border for better visibility */
}

/* Ensure Form Groups are Centered */
.form-group-2 {
  display: flex;
  flex-direction: column;
  align-items: center; /* Centers labels and inputs */
  justify-content: center;
  width: 100%;
  gap: 15px; /* Adds spacing between fields */
}


.form-group.full-width {
  width: 100%;
}

.form-group label {
  font-weight: 500;
  margin-bottom: 8px;
}

.form-group input {
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
  font-size: 0.95rem;
  box-sizing: border-box;
}

.button-group {
  margin-top: 20px;
  display: flex;
  gap: 15px;
}

.save-btn, .reset-btn, .delete-btn {
  background-color: #ffe96b;
  padding: 10px 18px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

.save-btn:hover, .reset-btn:hover, .delete-btn:hover {
  opacity: 0.9;
}

.reset-btn {
  background-color: #ffe96b;
}

.delete-btn {
  background-color: #f66;
  color: white;
}

.save-btn-container {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}
/* pop up */

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; bottom: 0; right: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

/* Reset Password Modal */
.reset-modal {
  background-image: url('@/assets/image.png'); /* Honeycomb background */
  background-size: cover;
  background-position: center;
  padding: 50px 80px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  text-align: center;
  position: relative;
  width: 600px;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Text Centering */
h2 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
}

/* Centering Input Text */
.centered-input {
  text-align: center; /* Centers text inside the input field */
  width: 80%; /* Ensures inputs are aligned properly */
  margin: 0 auto; /* Centers input fields horizontally */
  display: block; /* Prevents input from shrinking */
}

/* Forgot Password Styling */
.forgot-password {
  margin-top: 10px;
  cursor: pointer;
  text-decoration: underline;
  font-size: 1rem;
  color: #d69e2e;
  text-align: center; /* Center align text */
  display: block;
}

.forgot-password:hover {
  color: #b7791f;
}

/* Back to Reset Password */
.back-to-reset {
  margin-top: 15px;
  cursor: pointer;
  font-size: 1rem;
  text-decoration: underline;
  color: #555;
}

.back-to-reset:hover {
  color: #333;
}

/* Confirm Button */
.confirm-btn {
  background-color: #f4a261;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: bold;
  margin-top: 15px;
}

.confirm-btn:hover {
  background-color: #e76f51;
}

/* Close Button */
.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  border: none;
  background: none;
  font-size: 2rem;
  cursor: pointer;
  color: #555;
}

.close-btn:hover {
  color: #e76f51;
}

</style>
  