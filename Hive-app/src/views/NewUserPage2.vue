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

      <!-- Custom School Picker -->
      <div v-if="isStudying" class="text-field custom-picker">
        <label>What school are you from?</label>
        <div class="custom-dropdown" @click="toggleDropdown('school')">
          <span>{{ selectedSchoolLabel }}</span>
          <i class="dropdown-icon"></i>
        </div>
        <div v-if="dropdownOpen.school" class="dropdown-options">
          <div
            v-for="option in schoolOptions"
            :key="option.value"
            class="dropdown-option"
            @click.stop="selectOption('school', option)"
          >
            {{ option.label }}
          </div>
        </div>
      </div>

      <!-- Custom Industry Picker -->
      <div v-if="isWorking" class="text-field custom-picker">
        <label>What industry are you from?</label>
        <div class="custom-dropdown" @click="toggleDropdown('industry')">
          <span>{{ selectedIndustryLabel }}</span>
          <i class="dropdown-icon"></i>
        </div>
        <div v-if="dropdownOpen.industry" class="dropdown-options">
          <div
            v-for="option in industryOptions"
            :key="option.value"
            class="dropdown-option"
            @click.stop="selectOption('industry', option)"
          >
            {{ option.label }}
          </div>
        </div>
      </div>

      <!-- Next Button -->
      <button @click="handleNext">Next</button>
    </div>

    <!-- Left Branding (Optional) -->
    <Branding />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
import { db, auth } from '@/firebase';
import Branding from '@/components/Branding.vue';

// ========== STATE ========== //

const allInterests = ref([]);
const selectedInterests = ref([]);
const searchTerm = ref('');
const isStudying = ref(false);
const isWorking = ref(false);
const school = ref('');
const industry = ref('');
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
});

const filteredInterests = computed(() => {
  if (!searchTerm.value) {
    return allInterests.value;
  }
  const term = searchTerm.value.toLowerCase();
  return allInterests.value.filter(interest =>
    interest.toLowerCase().includes(term)
  );
});

const toggleInterest = (interest) => {
  const index = selectedInterests.value.indexOf(interest);
  if (index === -1) {
    selectedInterests.value.push(interest);
  } else {
    selectedInterests.value.splice(index, 1);
  }
};

// ========== CUSTOM DROPDOWN STATE ========== //

const dropdownOpen = reactive({
  school: false,
  industry: false
});

const schoolOptions = ref([
  { value: "NUS", label: "National University of Singapore (NUS)" },
  { value: "NTU", label: "Nanyang Technological University (NTU)" },
  { value: "SMU", label: "Singapore Management University (SMU)" },
  { value: "SUTD", label: "Singapore University of Technology and Design (SUTD)" },
  { value: "SUSS", label: "Singapore University of Social Sciences (SUSS)" }
]);

const industryOptions = ref([
  { value: "Technology", label: "Technology" },
  { value: "Finance", label: "Finance" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "Education", label: "Education" },
  { value: "Engineering", label: "Engineering" },
  { value: "Retail", label: "Retail" },
  { value: "Hospitality", label: "Hospitality" },
  { value: "Government", label: "Government" }
]);

const toggleDropdown = (key) => {
  dropdownOpen[key] = !dropdownOpen[key];
};

const selectOption = (key, option) => {
  if (key === 'school') {
    school.value = option.value;
  } else if (key === 'industry') {
    industry.value = option.value;
  }
  dropdownOpen[key] = false;
};

const selectedSchoolLabel = computed(() => {
  const selected = schoolOptions.value.find(opt => opt.value === school.value);
  return selected ? selected.label : 'Select Your University';
});

const selectedIndustryLabel = computed(() => {
  const selected = industryOptions.value.find(opt => opt.value === industry.value);
  return selected ? selected.label : 'Select Your Industry';
});

// ========== HANDLE NEXT ========== //

const handleNext = async () => {
  const user = auth.currentUser;
  if (!user) {
    console.error('No user is logged in');
    router.push({ name: 'Login' });
    return;
  }

  const dataToSave = {
    interests: selectedInterests.value,
    isStudying: isStudying.value,
    isWorking: isWorking.value,
    school: school.value,
    industry: industry.value,
  };

  try {
    await setDoc(doc(db, 'users', user.uid), dataToSave, { merge: true });
    console.log('Interests data saved successfully!');
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

h3 {
  margin-top: 0;
  margin-bottom: 10px;
}

.search-bar {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

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

.interest-item.selected {
  background-color: #77dd77;
}

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

/* Custom Picker Styles */
.text-field {
  margin-bottom: 15px;
  position: relative;
}

.custom-picker label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.custom-dropdown {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  background-color: #fff;
}

.dropdown-icon {
  border: solid #777;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
}

.dropdown-options {
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-top: 5px;
  background: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: absolute;
  z-index: 10;
  width: 100%;
  max-height: 150px;
  overflow-y: auto;
}

.dropdown-option {
  padding: 8px 12px;
  cursor: pointer;
}

.dropdown-option:hover {
  background-color: #f0f0f0;
}

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
