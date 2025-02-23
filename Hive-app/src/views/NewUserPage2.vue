<template>
    <div class="user-container">
      <!-- Right Section: Interests Form -->
      <div class="interests-form">
        <div class="form-content">
        <h3>What are your Interests?</h3>
  
        <!-- Search Bar -->
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Search"
          class="search-bar"
        />
  
        <!-- Interests List -->
        <div class="interests-list">
          <span
            v-for="interest in filteredInterests"
            :key="interest"
            :class="['interest-item', { selected: selectedInterests.includes(interest) }]"
            @click="toggleInterest(interest)"
          >
            {{ interest }}
          </span>
        </div>
    </div>
        <!-- Studying & Working Checkboxes -->
        <div class="checkboxes">
          <label>
            <input type="checkbox" v-model="isStudying" /> Studying
          </label>
          <label>
            <input type="checkbox" v-model="isWorking" /> Working
          </label>
        </div>
  
        <!-- School & Industry -->
        <div v-if="isStudying" class="text-field">
          <label>What school are you from?</label>
          <input type="text" v-model="school" placeholder="Search" />
        </div>
        <div v-if="isWorking" class="text-field">
          <label>What industry are you from?</label>
          <input type="text" v-model="industry" placeholder="What industry?" />
        </div>
  
        <!-- Next Button -->
        <button @click="handleNext" >Next</button>
      </div>
  
      <!-- Left Branding (Optional) -->
      <Branding />
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
  import { db, auth } from '@/firebase';
  import Branding from '@/components/Branding.vue';
  
  // ========== STATE ========== //
  
  // We store all possible interests in an array. 

  const allInterests = ref([]);
  
  // This will store user-selected interests
  const selectedInterests = ref([]);
  
  // For searching
  const searchTerm = ref('');
  
  // Checkboxes
  const isStudying = ref(false);
  const isWorking = ref(false);
  
  // Additional fields
  const school = ref('');
  const industry = ref('');
  
  // Router
  const router = useRouter();
  

  onMounted(async () => {
  
    try {
        const querySnapshot = await getDocs(collection(db, "interests"));
        const fetchedInterests = [];
        querySnapshot.forEach((docSnap) => {
        if (docSnap.exists()) {
            fetchedInterests.push(docSnap.data().name);
        }
        });
        console.log("Fetched interests:", fetchedInterests);
        allInterests.value = fetchedInterests;
    } catch (error) {
        console.error("Error fetching interests:", error);
    }
    /*
    allInterests.value = [
      'Boxing', 'Basketball', 'Bowling', 'Video Games', 'Netball', 'Art',
      'Movies', 'Soccer', 'Bouldering'
    ];
    */
  });
  
  // ========== COMPUTED PROPERTIES ========== //
  const filteredInterests = computed(() => {
    // If no search term, return all
    if (!searchTerm.value) {
      return allInterests.value;
    }
    // Filter by search term
    const term = searchTerm.value.toLowerCase();
    return allInterests.value.filter(interest =>
      interest.toLowerCase().includes(term)
    );
  });
  
  // ========== METHODS ========== //
  const toggleInterest = (interest) => {
    const index = selectedInterests.value.indexOf(interest);
    if (index === -1) {
      // Not in array => add it
      selectedInterests.value.push(interest);
    } else {
      // Already selected => remove it
      selectedInterests.value.splice(index, 1);
    }
  };
  
  const handleNext = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.error('No user is logged in');
      router.push({ name: 'Login' });
      return;
    }
  
    // Build object with all new fields
    const dataToSave = {
      interests: selectedInterests.value,
      isStudying: isStudying.value,
      isWorking: isWorking.value,
      school: school.value,
      industry: industry.value,
    };
  
    try {
      // Use setDoc with { merge: true } so we don't overwrite the previous fields
      await setDoc(doc(db, 'users', user.uid), dataToSave, { merge: true });
      console.log('Interests data saved successfully!');
  
      // Move to next page 
      router.push({ name: 'NewUserPage3' });
    } catch (error) {
      console.error('Error saving interests data:', error);
    }
  };
  </script>
  
  <style scoped>
  .user-container {
    display: flex;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    overflow-x: hidden;
  }
  
  /* Right side form container */
  .interests-form {
    width: 50vw !important;
    max-width: 50vw;
    min-width: 40vw;
    display: flex;
    flex-direction: column;
    padding: 3rem;
    background: white;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
    height: 80vh;
    
  }

  .form-content {
    flex: 1;         
    overflow-y: auto; 
    padding: 1rem;
    overflow-x: hidden;
    box-sizing: border-box;
    }
  
  /* Simple heading */
  h3 {
    margin-top: 0;
    margin-bottom: 10px;
  }
  
  /* Search Bar */
  .search-bar {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border-radius: 8px;
    border: 1px solid #ccc;
    box-sizing: border-box;
  }
  
  /* Interests List (inline tags) */
  .interests-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 15px;
  }
  
  .interest-item {
    background-color: #eee;
    padding: 8px 12px;
    border-radius: 20px;
    cursor: pointer;
    user-select: none;
  }
  
  .interest-item:hover {
    background-color: #ddd;
  }
  
  /* Highlight selected interest in green */
  .interest-item.selected {
    background-color: #77dd77; 
  }
  
  /* Checkboxes */
  .checkboxes {
    display: flex;
    gap: 20px;
    margin-bottom: 15px;
  }
  
  .checkboxes label {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  /* Additional text fields for school & industry */
  .text-field {
    margin-bottom: 15px;
  }
  
  .text-field input {
    width: 100%;
    padding: 8px;
    border-radius: 8px;
    border: 1px solid #ccc;
  }
  
  /* Next Button */
  button {
    align-self: flex-start;
    padding: 12px;
    background: black;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 18px;
    width: 100%;
    cursor: pointer;
    transition: background 0.3s ease;
    box-sizing: border-box;
  }
  
  button:hover {
    background: #333;
  }

 
  </style>
  