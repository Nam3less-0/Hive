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

  <!-- Selected Interests Display -->
  <div class="interests-container">
    <div v-for="(interest, index) in userData.interests" :key="index" class="interest-tag">
      {{ interest }}
      <button class="remove-btn" @click="removeInterest(index)">✖</button>
    </div>
  </div>

  <!-- Interest Selection & Input -->
  <div class="interest-selection">
    <div class="dropdown">
    <button class="dropdown-button" @click="toggleDropdown">
      {{ selectedInterest || "Choose an Interest" }}
    </button>
    <ul v-if="isDropdownOpen" class="dropdown-menu">
      <li v-for="interest in predefinedInterests" 
          :key="interest" 
          @click="selectInterest(interest)">
        {{ interest }}
      </li>
    </ul>
  </div>
    <button class="add-interests-btn" @click="addInterest(selectedInterest)">＋</button>
  </div>

  <div class="interest-selection">
    <input v-model="newInterest" placeholder="Type your own interest" class="input-field" />
    <button class="add-interests-btn" @click="addInterest(newInterest, true)">＋</button>
  </div>
</section>
      
<section class="content-container">
  <h2>About Me</h2>

  <div class="about-me-grid">
    <!-- Height -->
    <div class="form-group">
      <label>Height</label>
      <input v-model="userData.height" type="text" class="input-field" />
    </div>

    <!-- Orientation -->
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

    <!-- Purpose -->
    <div class="form-group">
      <label>Purpose</label>
      <select v-model="userData.purpose" class="input-field">
        <option disabled value="">Select Purpose</option>
        <option value="Dating">Meet new people</option>
        <option value="Friendship">Looking for a casual relationship</option>
        <option value="Long-term Relationship">Looking for a serious relationship</option>
      </select>
    </div>

    <!-- Race -->
    <div class="form-group">
      <label>Race</label>
      <select v-model="userData.race" class="input-field">
        <option disabled value="">Select Race</option>
        <option value="Chinese">Chinese</option>
        <option value="Malay">Malay</option>
        <option value="Indian">Indian</option>
        <option value="Eurasian">Eurasian</option>
        <option value="others">Others</option>
      </select>
    </div>

    <!-- Custom Race (shown only when race is "Other") -->
    <div class="form-group" v-if="userData.race === 'others'">
      <label>Specify Race</label>
      <input v-model="userData.customRace" type="text" placeholder="Enter your race" class="input-field" />
    </div>


    <!-- Religion -->
    <div class="form-group">
      <label>Religion</label>
      <select v-model="userData.religion" class="input-field">
        <option disabled value="">Select Religion</option>
        <option value="Christian">Christian</option>
        <option value="Buddhist">Buddhist</option>
        <option value="Taoist">Taoist</option>
        <option value="Muslim">Muslim</option>
        <option value="Hindu">Hindu</option>
        <option value="others">Others</option>
      </select>
    </div>

    <div class="form-group" v-if="userData.religion === 'others'">
      <label>Specify Religion</label>
      <input v-model="userData.customReligion" type="text" placeholder="Enter your religion" class="input-field" />
    </div>

    <!-- School -->
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

    <!-- Smoking -->
    <div class="form-group">
      <label>Smoking</label>
      <select v-model="userData.smoking" class="input-field">
        <option disabled value="">Select Smoking Preference</option>
        <option value="non-smoker">Non-smoker</option>
        <option value="social-smoker">Social smoker</option>
        <option value="light-smoker">Light smoker</option>
        <option value="moderate-smoker">Regular smoker</option>
        <option value="heavy-smoker">Heavy smoker</option>
      </select>
    </div>

    <!-- Alcohol -->
    <div class="form-group">
      <label>Alcohol</label>
      <select v-model="userData.alcohol" class="input-field">
        <option disabled value="">Select Alcohol Preference</option>
        <option value="non-drinker">Non-drinker</option>
        <option value="social-drinker">Social drinker</option>
        <option value="light-drinker">Light drinker</option>
        <option value="moderate-drinker">Regular drinker</option>
        <option value="heavy-drinker">Heavy drinker</option>
      </select>
    </div>
  </div>
</section>


     
      
      <!-- My Account Section -->
      <section class="content-container">
  <h2>My Account</h2>

  <div class="my-account-grid">
    <!-- First Name -->
    <div class="form-group">
      <label>First Name</label>
      <input v-model="userData.firstName" type="text" placeholder="First Name" class="input-field" />
    </div>

    <!-- Last Name -->
    <div class="form-group">
      <label>Last Name</label>
      <input v-model="userData.lastName" type="text" placeholder="Last Name" class="input-field" />
    </div>

    <!-- Height -->
   

    <!-- Date of Birth -->
    <div class="form-group">
      <label>Date of Birth</label>
      <input v-model="userData.dateOfBirth" type="date" class="input-field" />
    </div>

    <!-- School -->


    <!-- Industry -->
    <div class="form-group">
      <label>Industry</label>
      <select v-model="userData.industry" class="input-field">
        <option disabled value="">Select Industry</option>
        <option value="Technology">Technology</option>
        <option value="Finance">Finance</option>
        <option value="Healthcare">Healthcare</option>
        <option value="Education">Education</option>
        <option value="Engineering">Engineering</option>
        <option value="Retail">Retail</option>
        <option value="Hospitality">Hospitality</option>
        <option value="Government">Government</option>
        <option value="Other">Other</option>
      </select>
    </div>
  </div>
</section>

     
      
 
      
      <section class="content-container">
        <h2>Security</h2>
        <div class="security-form">
          <div class="form-group full-width">
            <label>Email</label>
            <input type="email" v-model="userData.email" class="input-field" :style="{ maxWidth: '100%' }" disabled />
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
            <input type="password" v-model="currentPassword" placeholder="Enter Current Password" class="input-field2" />
            <input type="password" v-model="newPassword" placeholder="Enter New Password" class="input-field2" />
            <input type="password" v-model="confirmNewPassword" placeholder="Confirm New Password" class="input-field2" />
            <p class="forgot-password" @click="isForgotPassword = true">Forgot Password?</p>
            <button class="confirm-btn" @click="changePassword">Confirm</button>
          </div>
          <div v-if="isForgotPassword">
            <h2>Forgot Password?</h2>
            <p>Enter your email to receive a password reset link.</p>
            <input type="email" v-model="userEmail" placeholder="Enter your email" class="input-field2" />
            <button class="confirm-btn" @click="forgotPassword">Send Reset Email</button>
            <p class="back-to-reset" @click="isForgotPassword = false">Back</p>
          </div>
        </div>
      </div>
      
      <div class="save-profile-container">
        <button class="save-profile-btn" @click="saveProfile">Save Profile</button>
      </div>
    </main>
    <div v-if="showNotification" class="notification-toast" :class="notificationType">
  {{ notificationMessage }}
  <div class="progress-bar"></div>
</div>
  </div>
  
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { auth, db } from '@/firebase';
import { collection, doc, getDoc, updateDoc, deleteDoc, getDocs, setDoc } from 'firebase/firestore';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider, sendPasswordResetEmail, deleteUser } from 'firebase/auth';
import Sidebar from '@/components/Sidebar.vue'
import { onAuthStateChanged } from 'firebase/auth';
import { storage} from '@/firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const isDropdownOpen = ref(false);
const selectedInterest = ref("");
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
const predefinedInterests = ref([]);
const showNotification = ref(false);
const notificationMessage = ref("");
const notificationType = ref("success");



// **Trigger File Input Click**

import { deleteObject } from 'firebase/storage';

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const selectInterest = (interest) => {
  selectedInterest.value = interest;
  isDropdownOpen.value = false; // Close dropdown after selection
};

async function fetchInterests() {
  try {
    const querySnapshot = await getDocs(collection(db, 'interests'));

    predefinedInterests.value = querySnapshot.docs.map(doc => doc.data().name);

    console.log('Interests fetched:', predefinedInterests.value);
  } catch (error) {
    console.error('Error fetching interests:', error);
  }
}

// **Trigger File Input Click**
const triggerFileInput = () => {
  fileInput.value.click();
};

const setAsMainPic = async (newMainPic) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      triggerNotification('You must be logged in to update your profile picture.', "error");
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
    triggerNotification('Error: ' + error.message, "error");
  }
};

const triggerNotification = (message, type = "success") => {
  notificationMessage.value = message;
  notificationType.value = type;
  showNotification.value = true;

  setTimeout(() => {
    showNotification.value = false;
  }, 2000);
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

    const userDocRef = doc(db, `users/${user.uid}`);
    const userDocSnap = await getDoc(userDocRef);

    // ✅ Prevent duplicate file uploads
    const existingFilenames = (userDocSnap.data().images || []).map(url => {
      try {
        const parts = url.split('?')[0].split('/');
        return parts[parts.length - 1];
      } catch {
        return '';
      }
    });

    if (existingFilenames.includes(file.name)) {
      triggerNotification('This photo has already been uploaded.', 'error');
      return;
    }

    const filePath = `users/${user.uid}/profile-pictures/${file.name}`;
    const fileRef = storageRef(storage, filePath);

    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);

    let updatedImages = userDocSnap.data().images || [];
    updatedImages.push(downloadURL);

    await updateDoc(userDocRef, { images: updatedImages });

    if (updatedImages.length === 1) {
      mainPic.value = updatedImages[0];
    }
    secondaryPics.value = updatedImages.slice(1);
  } catch (error) {
    console.error('Error uploading image:', error);
    triggerNotification('Error uploading image: ' + error.message, "error");
  }
};

// **Remove Image**
const removeImage = async (imageUrl) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      notificationMessage.value = `You must be logged in to remove images.`;
        showNotification.value = true;
        notificationType.value = "error";
        console.log("✅ Notification should be visible now!");

    // ✅ Auto-hide the notification after 3 seconds
        setTimeout(() => {
          console.log("⏳ Hiding notification...");
          showNotification.value = false;
        }, 2000);
      return;
    }

    const userDocRef = doc(db, `users/${user.uid}`);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      let updatedImages = userDocSnap.data().images || [];

      // 🚨 Prevent deletion if it's the only image
      if (updatedImages.length === 1) {
        notificationMessage.value = `You cannot delete your only profile picture.`;
        showNotification.value = true;
        notificationType.value = "error";
        console.log("✅ Notification should be visible now!");

    // ✅ Auto-hide the notification after 3 seconds
        setTimeout(() => {
          console.log("⏳ Hiding notification...");
          showNotification.value = false;
        }, 2000);
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

    notificationMessage.value = 'Error: ' + error.message;
    showNotification.value = true;
    notificationType.value = "error";
    console.log("✅ Notification should be visible now!");

    // ✅ Auto-hide the notification after 3 seconds
    setTimeout(() => {
      console.log("⏳ Hiding notification...");
      showNotification.value = false;
    }, 2000);
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
        console.log(userData.purpose)
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
    notificationMessage.value = 'Profile updated successfully!';
    showNotification.value = true;
    notificationType.value = "success";
    console.log("✅ Notification should be visible now!");

    // ✅ Auto-hide the notification after 3 seconds
    setTimeout(() => {
      console.log("⏳ Hiding notification...");
      showNotification.value = false;
    }, 2000);
  } catch (error) {
    console.error('Error updating profile:', error);
    notificationMessage.value = 'Error: ' + error.message;
    showNotification.value = true;
    notificationType.value = "error";
    console.log("✅ Notification should be visible now!");

    // ✅ Auto-hide the notification after 3 seconds
    setTimeout(() => {
      console.log("⏳ Hiding notification...");
      showNotification.value = false;
    }, 2000);
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
      triggerNotification("Passwords do not match.","error");
      return;
    }
    const credential = EmailAuthProvider.credential(user.email, currentPassword.value);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword.value);
    triggerNotification("Password updated successfully!", "success");
    closePopup();
  } catch (error) {
    console.error("Error changing password:", error);
    triggerNotification("Error: " + error.message,"error");
  }
}

async function forgotPassword() {
  if (!userEmail.value) return triggerNotification('Please enter your email.',"error");
  try {
    await sendPasswordResetEmail(auth, userEmail.value);
    triggerNotification('Password reset email sent! Check your inbox.', "success");
    closePopup();
  } catch (error) {
    console.error('Error sending reset email:', error);
    triggerNotification('Error: ' + error.message, "error");
  }
}

async function deleteAccount() {
  try {
    const user = auth.currentUser;
    if (!user) return;
    await deleteDoc(doc(db, `users/${user.uid}`));
    await deleteUser(user);
    triggerNotification("Account deleted successfully.", "success");
  } catch (error) {
    console.error("Error deleting account:", error);
    triggerNotification('Error: ' + error.message, "error");
  }
}

async function addInterest(interest, isNew = false) {
  try {
    if (!interest) return triggerNotification("Please select an interest!", "error");

    const user = auth.currentUser;
    if (!user) return;

    const userDocRef = doc(db, `users/${user.uid}`);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      let updatedInterests = userDocSnap.data().interests || [];

      if (updatedInterests.includes(interest)) {
        triggerNotification("Interest already added!", "error");
        return;
      }

      updatedInterests.push(interest);

      // Update Firestore
      await updateDoc(userDocRef, { interests: updatedInterests });

      // If this is a new interest, add to interests collection
      if (isNew) {
        const interestDocRef = doc(collection(db, 'interests'), interest);
        await setDoc(interestDocRef, { name: interest });
      }

      // Update UI
      userData.value.interests = updatedInterests;
      selectedInterest.value = ""; // Reset selection
      newInterest.value = ""; // reset the input field

      triggerNotification("Interest added successfully!", "success");
    }
  } catch (error) {
    console.error("Error adding interest:", error);
    triggerNotification('Error: ' + error.message, "error");
  }
}

// 🔹 Remove interest from Firestore
async function removeInterest(index) {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const userDocRef = doc(db, `users/${user.uid}`);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      let updatedInterests = [...userDocSnap.data().interests]; // Clone the array

      updatedInterests.splice(index, 1); // Remove selected interest

      // Update Firestore
      await updateDoc(userDocRef, { interests: updatedInterests });

      // Update UI
      userData.value.interests = updatedInterests;
    }
  } catch (error) {
    console.error("Error removing interest:", error);
  }
}

onMounted(() => {
  fetchUserData();
  fetchInterests();
});
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

.notification-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
  overflow: hidden;
  z-index: 9999;
}

.notification-toast.success .progress-bar {
  background-color: rgba(0, 255, 51, 0.7);
}

.notification-toast.error .progress-bar {
  background-color: rgb(237, 0, 0);
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  animation: progressShrink 2s linear forwards;
}

@keyframes progressShrink {
  from { width: 100%; }
  to { width: 0%; }
}

/* Image Section */
.main-pic {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 1px solid #ddd;
  object-fit: cover;
  transition: transform 0.3s ease;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.main-pic-wrapper:hover .main-pic {
  transform: scale(1.03);
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
  border: 2px dashed #ccc;
  border-radius: 12px;
  background-color: #f9fafb;
  font-size: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #9ca3af;
  transition: background 0.2s ease;
}
.add-btn:hover {
  background-color: #fff;
  border-color: #facc15;
  color: #facc15;
}

/* Interests Section */
.interests-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
}

.interest-tag {
  display: flex;
  align-items: center;
  background: #f4f4f4;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 0.9rem;
  border-width: 10px;
  border-color: rgb(62, 60, 60);
}
.interest-tag:hover {
  background-color: #fef3c7;
}

.remove-btn {
  background: none;
  border: none;
  color: #ef4444;
  font-size: 1.1rem;
  margin-left: 10px;
  cursor: pointer;
  transition: transform 0.2s;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s;
  border-radius: 50%;

}



.remove-btn:hover {
  transform: scale(1.2);
}

.interest-selection {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.input-field {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 2px solid #d1d5db; /* Light gray border */
  font-size: 1rem;
  background-color: white;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 18px;
}
.input-field2 {
  width: 100%;
  max-width: 90%; /* Optional: keeps some padding from edges */
  padding: 10px;
  margin: 8px 0;
  box-sizing: border-box;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
}
.input-field2:hover, .input-field:focus {
  border-color: #f59e0b; /* Orange border */
  background-color: #fff7ed; /* Light orange background */
  box-shadow: 0px 4px 12px rgba(245, 158, 11, 0.2);
}

/* Hover and Focus Effect */
.input-field:hover, .input-field:focus {
  border-color: #f59e0b; /* Orange border */
  background-color: #fff7ed; /* Light orange background */
  box-shadow: 0px 4px 12px rgba(245, 158, 11, 0.2);
}

/* Style for Disabled Option */
.input-field option:disabled {
  color: #9ca3af;
}

.input-field option {
  max-height: 150px; /* Limits dropdown height */
  overflow-y: auto;
}

.selected {
  border-color: #10b981; /* Green border */
  background-color: #ecfdf5; /* Light green background */
  color: #065f46;
}

.add-interests-btn {
  background-color: #ffe96b;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease;
}
.add-interests-btn:hover {
  background-color: #facc15;
}
/* Description Section */ 
.desc-input {
  width: 90%;
  min-height: 120px;
  padding: 16px 20px;
  font-size: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  resize: vertical;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
}

.desc-input:focus {
  background-color: #fffef7;
  border-color: #facc15;
  box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.2);
  outline: none;
}

/* About Me Section */
.about-me-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
}



.input-field {
  width: 200%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ddd;
  font-size: 1rem;
}
.input-field:focus {
  border-color: #facc15;
  outline: none;
  background-color: #fffef7;
  box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.2);
}

select.input-field {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg fill='black' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 36px;
}

/* My Account & Security Sections */
.my-account-grid {
  display: grid;
  grid-template-columns: 1fr 1fr; /* Two columns */
  gap: 15px; /* Spacing between items */
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

.save-btn, .save-profile-btn {
  background-color: #ffe96b;
  padding: 10px 18px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  font-size: 16px;
}

.delete-btn {
  background-color: #f87171;
  color: black;
  padding: 10px 18px;
  border-radius: 10px;
  border: none;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.delete-btn:hover {
  color: white
}

.reset-btn {
  background-color: #ffe96b;
  color: black;
  padding: 10px 18px;
  border-radius: 10px;
  border: none;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.reset-btn:hover {
  color: white;
}


.reset-btn {
  background-color: #ffe96b;
}

.delete-btn {
  background-color: #f66;
  color: black;
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

.save-profile-btn:hover {
  color: white;
}

/* Wrapper */
.dropdown {
  position: relative;
  width: 100%;
}

/* Button */
.dropdown-button {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 2px solid #d1d5db;
  background-color: white;
  cursor: pointer;
  text-align: left;
}

/* Dropdown Menu */
.dropdown-menu {
  position: absolute;
  width: 100%;
  max-height: 150px; /* Limits dropdown height */
  overflow-y: auto;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: white;
  list-style-type: none;
  padding: 0;
  margin: 5px 0;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
}

/* Menu Items */
.dropdown-menu li {
  padding: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.dropdown-menu li:hover {
  background-color: #f59e0b; /* Orange hover */
  color: white;
}
</style>
