<template>
  <div class="user-container">
    <!-- Splash Screen Transition -->
    <transition name="fade" @after-leave="handleAfterSplash">
      <div v-if="showSplash" class="splash-screen">
        <p>Let's get to know you a little more...</p>
      </div>
    </transition>

    <!-- Interests Form Transition -->
    <transition name="fade">
      <div v-if="showForm" class="interests-form">
        <div class="form-content">
          <label id = "interests-title">What are your Interests?</label>
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

        <div v-if="showInterestTooltip" class="dropdown-tooltip">
          Please select at least one interest.
        </div>

        <!-- Tooltip if no interest is selected -->

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
          <!-- Tooltip -->
          <div
            v-if="showDropdownTooltip.school"
            class="dropdown-tooltip"
          >
            Please select your school
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
          <!-- Tooltip -->
          <div
            v-if="showDropdownTooltip.industry"
            class="dropdown-tooltip"
          >
            Please select your industry
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

        <p v-if="errorOccupation" class="error-message">
          Please select at least one: Studying or Working.
        </p>


        <!-- Next Button -->
        <button @click="handleNext">Next</button>
      </div>
    </transition>

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
const showInterestTooltip = ref(false);

// Splash and form display state
const showSplash = ref(true);
const showForm = ref(false);

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
  
  // Hide splash after 2 seconds. The after-leave callback will then show the form.
  setTimeout(() => {
    showSplash.value = false;
  }, 1000);
});

// Called after splash leave transition completes
function handleAfterSplash() {
  showForm.value = true;
}

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

const showDropdownTooltip = ref({
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
const errorOccupation = ref(false); // Define this at the top of <script setup>

const handleNext = async () => {
  errorOccupation.value = !(isStudying.value || isWorking.value);
  showDropdownTooltip.value.school = isStudying.value && !school.value;
  showDropdownTooltip.value.industry = isWorking.value && !industry.value;

  showInterestTooltip.value = selectedInterests.value.length === 0;
  const isValid =
  !errorOccupation.value &&
  selectedInterests.value.length > 0 &&
  (!isStudying.value || !!school.value) &&
  (!isWorking.value || !!industry.value);


  if (!isValid) return;

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
    router.push({ name: 'NewUserPage22' });
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

/* Splash screen styles */
.splash-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  font-size: 1.5rem;
  font-weight: bold;
  color: black;
  width: 50vw;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Fade Transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.75s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Interests Form Styles */
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

#interests-title {
  margin-top: 0;
  margin-bottom: 10px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: black;
  font-weight: bold;
}

.search-bar {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  background-color: #f9f9f9;
}

.interests-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
}

.interest-item {
  background-color: #ffe96b;
  padding: 8px 12px;
  border-radius: 20px;
  cursor: pointer;
  user-select: none;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.interest-item:hover {
  color: white;
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
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Custom Picker Styles */
.text-field {
  margin-bottom: 15px;
  position: relative;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 13px;
}

.custom-picker label {
  display: block;
  margin-bottom: 5px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: bold;
  color: black;
  font-size: 15px;

}

.custom-dropdown {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  background-color: #f9f9f9;
  color: #7a7a7a;
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
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.dropdown-option {
  padding: 8px 12px;
  cursor: pointer;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.dropdown-option:hover {
  background-color: #f0f0f0;
}

button {
  margin: 0 auto;
  align-self: flex-start;
  padding: 12px;
  background: #ffe96b;
  color: black;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  width: 100%;
  cursor: pointer;
  transition: background 0.3s ease;
  box-sizing: border-box;
}

button:hover {
  color: white;
}

.dropdown-tooltip {
  color: red;
  margin-top: 10px;
  font-size: 16px;
  font-weight: bold;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.error-message {
  color: red;
  margin-top: 10px;
  font-weight: bold;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

</style>
