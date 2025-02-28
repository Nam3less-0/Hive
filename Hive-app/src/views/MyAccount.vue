<template>
  <div class="layout">
    <Sidebar />
    <main class="myaccount-content">
      <section class="content-container">
  <h2>Profile Picture</h2>
  <div class="profile-pic-section">
    <div class="main-pic-wrapper">
      <img :src="mainPic || 'https://via.placeholder.com/200'" alt="Main profile pic" class="main-pic" />
      <button v-if="mainPic" class="remove-btn" @click="removeImage(mainPic)">✖</button>
    </div>
    
    <div class="secondary-pics">
      <div v-for="(pic, index) in secondaryPics" :key="index" class="secondary-pic-wrapper">
  <img :src="pic" alt="secondary" class="secondary" @click="setAsMainPic(pic)" />
  <button class="remove-btn" @click="removeImage(pic)">✖</button>
</div>
      
      <!-- Hidden file input -->
      <input type="file" ref="fileInput" @change="uploadImage" accept="image/*" hidden />
      
      <!-- Plus Button -->
      <button class="add-btn" @click="triggerFileInput">＋</button>
    </div>
  </div>
</section>
      
      
      <section class="content-container">
        <h2>Description</h2>
        <textarea v-model="userData.description" class="desc-input"></textarea>
      </section>
      
      <section class="content-container">
  <h2>Interests</h2>
  <div class="interests-tags">
    <span v-for="(interest, index) in userData.interests" :key="index">
      {{ interest }}
      <button class="remove-interest-btn" @click="removeInterest(index)">✖</button>
    </span>
  </div>

  <!-- Interest Dropdown -->
  <div class="form-group">
    <label>Select Interest</label>
    <select v-model="selectedInterest" class="input-field">
      <option disabled value="">Choose an Interest</option>
      <option v-for="interest in predefinedInterests" :key="interest" :value="interest">
        {{ interest }}
      </option>
    </select>
  </div>

  <!-- Add Selected Interest Button -->
  <button class="add-interest-btn" @click="addInterest(selectedInterest)">＋ Add Interest</button>

  <!-- Custom Interest Input -->
  <div class="form-group">
    <label>Or Add a Custom Interest</label>
    <input v-model="newInterest" placeholder="Type your own interest" class="input-field" />
  </div>

  <!-- Add Custom Interest Button -->
  <button class="add-interest-btn" @click="addInterest(newInterest)">＋ Add Custom Interest</button>
</section>
      
      <section class="content-container">
  <h2>About Me</h2>

  <!-- Height stays as an input field -->
  <table class="about-me-table">
    <tr><td>Height:</td><td><input v-model="userData.height" type="text" class="input-field" /></td></tr>
  </table>

  <!-- Orientation Dropdown -->
  <div class="form-group">
    <label>Orientation</label>
    <select v-model="userData.sexualOrientation" class="input-field">
      <option disabled value="">Select Orientation</option>
      <option value="Heterosexual">Heterosexual</option>
      <option value="Homosexual">Homosexual</option>
      <option value="Bisexual">Bisexual</option>
      <option value="Other">Other</option>
    </select>
  </div>

  <!-- Purpose Dropdown -->
  <div class="form-group">
    <label>Purpose</label>
    <select v-model="userData.purpose" class="input-field">
      <option disabled value="">Select Purpose</option>
      <option value="Dating">Meet new people</option>
      <option value="Friendship">Looking for a casual relationship</option>
      <option value="Long-term Relationship">Looking for a serious relationship</option>
    </select>
  </div>

  <!-- Race Dropdown -->
  <div class="form-group">
    <label>Race</label>
    <select v-model="userData.race" class="input-field">
      <option disabled value="">Select Race</option>
      <option value="Chinese">Chinese</option>
      <option value="Malay">Malay</option>
      <option value="Indian">Indian</option>
      <option value="Eurasian">Eurasian</option>
      <option value="Other">Others</option>
    </select>
  </div>

  <!-- Religion Dropdown -->
  <div class="form-group">
    <label>Religion</label>
    <select v-model="userData.religion" class="input-field">
      <option disabled value="">Select Religion</option>
      <option value="Christian">Christian</option>
      <option value="Buddhist">Buddhist</option>
      <option value="Taoist">Taoist</option>
      <option value="Muslim">Muslim</option>
      <option value="Hindu">Hindu</option>
      <option value="Other">Others</option>
    </select>
  </div>

  <!-- School Dropdown -->
  <div class="form-group">
    <label>School</label>
    <select v-model="userData.school" class="input-field">
      <option disabled value="">Select School</option>
      <option value="NUS">National University of Singapore (NUS)</option>
      <option value="NTU">Nanyang Technological University (NTU)</option>
      <option value="SMU">Singapore Management University (SMU)</option>
      <option value="SIT">Singapore Institute of Technology (SIT)</option>
      <option value="SUSS">Singapore University of Social Sciences (SUSS)</option>
      <option value="SUTD">Singapore University of Technology and Design (SUTD)</option>
      <option value="Other">Other</option>
    </select>
  </div>

  <!-- Smoking Dropdown -->
  <div class="form-group">
    <label>Smoking</label>
    <select v-model="userData.smoking" class="input-field">
      <option disabled value="">Select Smoking Preference</option>
      <option value="Yes">Non smoker</option>
      <option value="No">Social smoker</option>
      <option value="Occasionally">Light smoker</option>
      <option value="Yes">Moderate smoker</option>
      <option value="Yes">Heavy smoker</option>
    </select>
  </div>
  




  <!-- Alcohol Dropdown -->
  <div class="form-group">
    <label>Alcohol</label>
    <select v-model="userData.alcohol" class="input-field">
      <option disabled value="">Select Alcohol Preference</option>
      <option value="No">Non-drinker</option>
      <option value="Occasionally">Social drinker</option>
      <option value="Yes">Light drinker</option>
      <option value="Yes">Moderate drinker</option>
      <option value="Yes">Light drinker</option>
    </select>
  </div>

  






</section>

     
      
      <!-- My Account Section -->
      <section class="content-container">
        <h2>My Account</h2>
        <div class="account-form">
          <div class="form-group">
            <label>First Name</label>
            <input v-model="userData.firstName" type="text" placeholder="First Name" class="input-field" />
          </div>
          <div class="form-group">
            <label>Last Name</label>
            <input v-model="userData.lastName" type="text" placeholder="Last Name" class="input-field" />
          </div>
          <div class="form-group">
            <label>Height</label>
            <input v-model="userData.height" type="text" placeholder="Height" class="input-field" />
          </div>
          <div class="form-group">
            <label>Date of Birth</label>
            <input v-model="userData.dateOfBirth" type="date" class="input-field" />
          </div>
          <div class="form-group">
            <label>School</label>
            <input v-model="userData.school" type="text" placeholder="School" class="input-field" />
          </div>
          <div class="form-group">
            <label>Religion</label>
            <input v-model="userData.religion" type="text" placeholder="Religion" class="input-field" />
          </div>
          <div class="form-group">
            <label>Race</label>
            <input v-model="userData.race" type="text" placeholder="Race" class="input-field" />
          </div>
        </div>
      </section>

     
      
 
      
      <section class="content-container">
        <h2>Security</h2>
        <div class="security-form">
          <div class="form-group full-width">
            <label>Email</label>
            <input type="email" v-model="userData.email" class="input-field" disabled />
          </div>
          <div class="button-group">
            <button class="reset-btn" @click="openResetPopup">Reset Password</button>
            <button class="delete-btn" @click="deleteAccount">Delete Account</button>
          </div>
        </div>
      </section>
      
      <div v-if="showResetPopup" class="modal-overlay">
        <div class="reset-modal">
          <button class="close-btn" @click="closePopup">×</button>
          <div v-if="!isForgotPassword">
            <h2>Reset Password</h2>
            <input type="password" v-model="currentPassword" placeholder="Enter Current Password" class="input-field" />
            <input type="password" v-model="newPassword" placeholder="Enter New Password" class="input-field" />
            <input type="password" v-model="confirmNewPassword" placeholder="Confirm New Password" class="input-field" />
            <p class="forgot-password" @click="isForgotPassword = true">Forgot Password?</p>
            <button class="confirm-btn" @click="changePassword">Confirm</button>
          </div>
          <div v-if="isForgotPassword">
            <h2>Forgot Password?</h2>
            <p>Enter your email to receive a password reset link.</p>
            <input type="email" v-model="userEmail" placeholder="Enter your email" class="input-field" />
            <button class="confirm-btn" @click="forgotPassword">Send Reset Email</button>
            <p class="back-to-reset" @click="isForgotPassword = false">Back</p>
          </div>
        </div>
      </div>
      
      <div class="save-profile-container">
        <button class="save-profile-btn" @click="saveProfile">Save Profile</button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { auth, db } from '@/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider, sendPasswordResetEmail, deleteUser } from 'firebase/auth';
import Sidebar from '@/components/Sidebar.vue'
import { onAuthStateChanged } from 'firebase/auth';
import { storage} from '@/firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const userData = ref({});
const mainPic = ref('');
const secondaryPics = ref([]);
const newInterest = ref('');
const showResetPopup = ref(false);
const isForgotPassword = ref(false);
const currentPassword = ref('');
const newPassword = ref('');
const confirmNewPassword = ref('');
const userEmail = ref('');
const fileInput = ref(null);

// **Trigger File Input Click**

import { deleteObject } from 'firebase/storage';


// **Trigger File Input Click**
const triggerFileInput = () => {
  fileInput.value.click();
};

const setAsMainPic = async (newMainPic) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      alert('You must be logged in to update your profile picture.');
      return;
    }

    const userDocRef = doc(db, `users/${user.uid}`);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      let updatedImages = userDocSnap.data().images || [];

      // Find index of the new main picture
      const index = updatedImages.indexOf(newMainPic);
      if (index === -1 || index === 0) return; // If already main pic, do nothing

      // Remove the selected image from its position
      updatedImages.splice(index, 1);
      // Insert it at index 0 to make it the new main picture
      updatedImages.unshift(newMainPic);

      // Update Firestore
      await updateDoc(userDocRef, { images: updatedImages });

      // Update UI instantly
      mainPic.value = updatedImages[0];
      secondaryPics.value = updatedImages.slice(1);
    }
  } catch (error) {
    console.error('Error setting new main picture:', error);
    alert('Error: ' + error.message);
  }
};



// **Upload Image to Firebase Storage**
const uploadImage = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const user = auth.currentUser;
    if (!user) {
      alert('You must be logged in to upload images.');
      return;
    }

    const filePath = `users/${user.uid}/profile-pictures/${file.name}`;
    const fileRef = storageRef(storage, filePath);

    // Upload file to Firebase Storage
    await uploadBytes(fileRef, file);

    // Get image URL
    const downloadURL = await getDownloadURL(fileRef);

    // Update Firestore with new image URL
    const userDocRef = doc(db, `users/${user.uid}`);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      let updatedImages = userDocSnap.data().images || [];
      updatedImages.push(downloadURL); // Append new image

      await updateDoc(userDocRef, { images: updatedImages });

      // Update UI
      if (updatedImages.length === 1) {
        mainPic.value = updatedImages[0]; // First image becomes mainPic
      }
      secondaryPics.value = updatedImages.slice(1); // Remaining as secondary
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    alert('Error uploading image: ' + error.message);
  }
};

// **Remove Image**
const removeImage = async (imageUrl) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      alert('You must be logged in to remove images.');
      return;
    }

    const userDocRef = doc(db, `users/${user.uid}`);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      let updatedImages = userDocSnap.data().images || [];

      // 🚨 Prevent deletion if it's the only image
      if (updatedImages.length === 1) {
        alert("You cannot delete your only profile picture.");
        return;
      }

      // Remove selected image
      updatedImages = updatedImages.filter((img) => img !== imageUrl);

      // Update Firestore with new image list
      await updateDoc(userDocRef, { images: updatedImages });

      // Delete from Firebase Storage
      const fileRef = storageRef(storage, imageUrl);
      await deleteObject(fileRef);

      // Update UI dynamically
      if (imageUrl === mainPic.value) {
        mainPic.value = updatedImages[0] || ''; // Set next available image as main
      }
      secondaryPics.value = updatedImages.slice(1);
    }
  } catch (error) {
    console.error('Error removing image:', error);
    alert('Error: ' + error.message);
  }
};


async function fetchUserData() {
  try {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.error("No user is logged in.");
        return;
      }

      // Ensure email is retrieved immediately
      userEmail.value = user.email || ''; // Assign user email

      const userDocRef = doc(db, `users/${user.uid}`);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        userData.value = userDocSnap.data();
        const images = userData.value.images || [];
        mainPic.value = images[0] || '';
        secondaryPics.value = images.slice(1);

        // Assign email to userData as well, to ensure reactivity
        userData.value.email = user.email || '';
      } else {
        console.error("User document not found in Firestore.");
      }
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}

async function saveProfile() {
  try {
    const user = auth.currentUser;
    if (!user) return;
    const userDocRef = doc(db, `users/${user.uid}`);
    await updateDoc(userDocRef, userData.value);
    alert('Profile updated successfully!');
  } catch (error) {
    console.error('Error updating profile:', error);
    alert('Error: ' + error.message);
  }
}

function openResetPopup() {
  showResetPopup.value = true;
}

function closePopup() {
  showResetPopup.value = false;
  isForgotPassword.value = false;
}

async function changePassword() {
  try {
    const user = auth.currentUser;
    if (!user || newPassword.value !== confirmNewPassword.value) {
      alert("Passwords do not match.");
      return;
    }
    const credential = EmailAuthProvider.credential(user.email, currentPassword.value);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword.value);
    alert("Password updated successfully!");
    closePopup();
  } catch (error) {
    console.error("Error changing password:", error);
    alert("Error: " + error.message);
  }
}

async function forgotPassword() {
  if (!userEmail.value) return alert('Please enter your email.');
  try {
    await sendPasswordResetEmail(auth, userEmail.value);
    alert('Password reset email sent! Check your inbox.');
    closePopup();
  } catch (error) {
    console.error('Error sending reset email:', error);
    alert('Error: ' + error.message);
  }
}

async function deleteAccount() {
  try {
    const user = auth.currentUser;
    if (!user) return;
    await deleteDoc(doc(db, `users/${user.uid}`));
    await deleteUser(user);
    alert("Account deleted successfully.");
  } catch (error) {
    console.error("Error deleting account:", error);
    alert("Error: " + error.message);
  }
}

onMounted(fetchUserData);
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

/* Image Section */
.main-pic {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 1px solid #ddd;
}

.profile-pic-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.secondary-pics {
  display: flex;
  gap: 8px;
}

.secondary-pics img {
  width: 100px;
  height: 100px;
  border-radius: 6px;
  border: 1px solid #ddd;
}

.add-btn {
  width: 100px;
  height: 100px;
  border: 1px dashed #ccc;
  border-radius: 6px;
  background-color: #f6f6f6;
  font-size: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

/* Interests Section */
.interests-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.interests-tags span {
  background: #f6f6f6;
  padding: 10px 15px;
  border-radius: 6px;
  border: 1px solid #ddd;
  font-size: 0.95rem;
  line-height: 1.2;
}

.add-interest-btn {
  background: #f6f6f6;
  padding: 10px 15px;
  border-radius: 6px;
  border: 1px solid #ddd;
  font-size: 1.2rem;
  cursor: pointer;
}

/* Description Section */
.desc {
  background: #f6f6f6;
  padding: 10px;
  border-radius: 6px;
  line-height: 1.6;
  margin: 10px 0;
}

/* About Me Section */
.about-me-table td {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

/* My Account & Security Sections */
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

/* Centering Input Text */
.centered-input-2 {
  text-align: center;
  width: 90%;
  height: 10px;
  font-size: 1.2rem;
  padding: 10px;
  border-radius: 8px;
  border: 2px solid #d69e2e;
}

/* Ensure Form Groups are Centered */
.form-group-2 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 15px;
}

/* Button Group */
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

/* Modal Popup */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; bottom: 0; right: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.reset-modal {
  background-image: url('@/assets/image.png');
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

h2 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.centered-input {
  text-align: center;
  width: 80%;
  margin: 0 auto;
  display: block;
}

.forgot-password {
  margin-top: 10px;
  cursor: pointer;
  text-decoration: underline;
  font-size: 1rem;
  color: #d69e2e;
  text-align: center;
  display: block;
}

.forgot-password:hover {
  color: #b7791f;
}

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
.save-profile-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.save-profile-btn {
  background-color: #4CAF50;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.save-profile-btn:hover {
  background-color: #45a049;
}
</style>
