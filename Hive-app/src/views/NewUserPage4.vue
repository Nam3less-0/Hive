<template>
    <div class="page-container">
      <!-- Left Section: Image Upload Form -->
      <div class="image-upload-form">
        <div class="header">
          <h3>Upload your profile images</h3>
          <span class="counter">({{ selectedCount }} out of 5 selected)</span>
        </div>
  
        <label class="custom-file-upload">
          <input type="file" multiple accept="image/*" @change="handleFilesUpload" hidden />
          Choose Images
        </label>
  
        <div class="preview-container">
          <div
            v-for="(img, index) in imagePreviews"
            :key="index"
            class="image-preview"
          >
            <img :src="img" alt="Image Preview" />
            <button @click="removeImage(index)" class="remove-button">&times;</button>
          </div>
        </div>
  
        <!-- Warning message when no image is selected -->
        <div class="warning-message" v-if="selectedFiles.length < 1">
          Please upload at least one image.
        </div>
  
        <button
          @click="finishSetup"
          :disabled="!canSubmit"
          class="finish-button"
        >
          Finish Setup Profile
        </button>
      </div>
  
      <!-- Right Section: Branding -->
      <Branding />
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { doc, setDoc } from 'firebase/firestore';
  import { db, auth, storage } from '@/firebase';
  import Branding from '@/components/Branding.vue';
  import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
  
  // Router
  const router = useRouter();
  
  // State to hold selected files and their preview URLs
  const selectedFiles = ref([]);
  const imagePreviews = ref([]);
  
  // Computed counter for selected images
  const selectedCount = computed(() => selectedFiles.value.length);
  
  // Handle file input changes
  const handleFilesUpload = (event) => {
    const files = event.target.files;
    if (!files) return;
    
    // Loop through files; add each until we reach 5 images max
    for (let i = 0; i < files.length; i++) {
      if (selectedFiles.value.length >= 5) break;
      const file = files[i];
      selectedFiles.value.push(file);
      imagePreviews.value.push(URL.createObjectURL(file));
    }
  };
  
  // Remove an image from selection
  const removeImage = (index) => {
    selectedFiles.value.splice(index, 1);
    imagePreviews.value.splice(index, 1);
  };
  
  // Ensure at least 1 image and no more than 5 images are selected
  const canSubmit = computed(() => {
    return selectedFiles.value.length >= 1 && selectedFiles.value.length <= 5;
  });
  
  // Finish setup: upload images and save their URLs in Firestore
  const finishSetup = async () => {
    if (!canSubmit.value) {
      console.error('Please upload between 1 and 5 images.');
      return;
    }
  
    const user = auth.currentUser;
    if (!user) {
      console.error('No user is logged in');
      router.push({ name: 'Login' });
      return;
    }
  
    const uploadedImageUrls = [];
  
    // Upload each image to Firebase Storage
    for (let i = 0; i < selectedFiles.value.length; i++) {
      const file = selectedFiles.value[i];
      // Unique filename: userID, timestamp and index
      const fileRef = storageRef(
        storage,
        `profile_images/${user.uid}_${Date.now()}_${i}`
      );
      try {
        await uploadBytes(fileRef, file);
        const downloadUrl = await getDownloadURL(fileRef);
        uploadedImageUrls.push(downloadUrl);
      } catch (error) {
        console.error(`Error uploading image ${i + 1}:`, error);
      }
    }
  
    // Save the array of image URLs under the "images" field in Firestore
    try {
      await setDoc(
        doc(db, 'users', user.uid),
        { images: uploadedImageUrls },
        { merge: true }
      );
      console.log('Profile images saved successfully!');
      router.push({ name: 'LoadingPage' });
    } catch (error) {
      console.error('Error saving images to Firestore:', error);
    }
  };
  </script>
  
  <style scoped>
  .page-container {
    display: flex;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
  
  /* Left side: Image Upload Form */
  .image-upload-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 50vw;
    padding: 3rem;
    background: #fff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }
  
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 5px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 25px;
  }
  
  
  .counter {
    font-size: 1rem;
    color: #555;
  }
  
  .subheading {
    margin: 0 0 20px 0;
    font-size: 0.9rem;
    color: #777;
  }
  
  .custom-file-upload {
    display: inline-block;
    padding: 10px 20px;
    margin-bottom: 20px;
    cursor: pointer;
    background-color: #ffe96b;
    color: black;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    text-align: center;
    transition: background-color 0.3s ease;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  .custom-file-upload:hover {
    color: white;
  }
  
  input[type="file"] {
    display: none;
  }
  
  .preview-container {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 20px;
  }
  
  .image-preview {
    position: relative;
    width: 120px;
    height: 120px;
    border: 1px solid #ccc;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .image-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .remove-button {
    position: absolute;
    top: 5px;
    right: 5px;
    background: rgba(255, 0, 0, 0.7);
    color: white;
    border: none;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    cursor: pointer;
    font-size: 16px;
    line-height: 20px;
    padding: 0;
  }
  
  .warning-message {
    background-color: #ffdddd;
    color: #d8000c;
    border: 1px solid #d8000c;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 20px;
    text-align: center;
    font-size: 0.9rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  .finish-button {
    align-self: center;
    padding: 12px 20px;
    background: #f9f9f9;
    color: black;
    border: 1px solid #ccc; 
    border-radius: 8px;
    font-size: 1.2rem;
    cursor: pointer;
    transition: background 0.3s ease;
    width: 100%;
    font-size: 15px;
  }
  
  .finish-button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  
  .finish-button:hover:enabled {
    background: green;
  }
  </style>
  