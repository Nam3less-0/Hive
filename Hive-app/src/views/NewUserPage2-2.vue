<template>
  <div class="user-container">
    <div class="info-form">
      <h2>Tell us more about yourself</h2>

      <!-- Smoking Picker -->
      <div class="text-field custom-picker">
        <label>Do you smoke?</label>
        <div class="custom-dropdown" @click="toggleDropdown('smoking'); clearTooltip('smoking')">
          <span>{{ selectedSmokingLabel }}</span>
          <i class="dropdown-icon"></i>
        </div>
        <div v-if="showDropdownTooltip.smoking" class="dropdown-tooltip">
          Please select your smoking status
        </div>
        <div v-if="dropdownOpen.smoking" class="dropdown-options">
          <div
            v-for="option in smokingOptions"
            :key="option.value"
            class="dropdown-option"
            @click.stop="selectOption('smoking', option)"
          >
            {{ option.label }}
          </div>
        </div>
      </div>

      <!-- Alcohol Picker -->
      <div class="text-field custom-picker">
        <label>Do you drink alcohol?</label>
        <div class="custom-dropdown" @click="toggleDropdown('alcohol'); clearTooltip('alcohol')">
          <span>{{ selectedAlcoholLabel }}</span>
          <i class="dropdown-icon"></i>
        </div>
        <div v-if="showDropdownTooltip.alcohol" class="dropdown-tooltip">
          Please select your alcohol preference
        </div>
        <div v-if="dropdownOpen.alcohol" class="dropdown-options">
          <div
            v-for="option in alcoholOptions"
            :key="option.value"
            class="dropdown-option"
            @click.stop="selectOption('alcohol', option)"
          >
            {{ option.label }}
          </div>
        </div>
      </div>

      <!-- Sexual Orientation Picker -->
      <div class="text-field custom-picker">
        <label>Sexual Orientation</label>
        <div class="custom-dropdown" @click="toggleDropdown('sexualOrientation'); clearTooltip('sexualOrientation')">
          <span>{{ selectedSexualOrientationLabel }}</span>
          <i class="dropdown-icon"></i>
        </div>
        <div v-if="showDropdownTooltip.sexualOrientation" class="dropdown-tooltip">
          Please select your sexual orientation
        </div>
        <div v-if="dropdownOpen.sexualOrientation" class="dropdown-options">
          <div
            v-for="option in sexualOrientationOptions"
            :key="option.value"
            class="dropdown-option"
            @click.stop="selectOption('sexualOrientation', option)"
          >
            {{ option.label }}
          </div>
        </div>
      </div>

      <!-- Purpose Picker -->
      <div class="text-field custom-picker">
        <label>Purpose of using the app</label>
        <div class="custom-dropdown" @click="toggleDropdown('purpose'); clearTooltip('purpose')">
          <span>{{ selectedPurposeLabel }}</span>
          <i class="dropdown-icon"></i>
        </div>
        <div v-if="showDropdownTooltip.purpose" class="dropdown-tooltip">
          Please select your purpose
        </div>
        <div v-if="dropdownOpen.purpose" class="dropdown-options">
          <div
            v-for="option in purposeOptions"
            :key="option.value"
            class="dropdown-option"
            @click.stop="selectOption('purpose', option)"
          >
            {{ option.label }}
          </div>
        </div>
      </div>

      <!-- Next Button -->
      <button @click="handleNext">Next</button>
    </div>

    <Branding />
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '@/firebase';
import Branding from '@/components/Branding.vue';

const smoking = ref('');
const alcohol = ref('');
const sexualOrientation = ref('');
const purpose = ref('');
const router = useRouter();

const showDropdownTooltip = ref({
  smoking: false,
  alcohol: false,
  sexualOrientation: false,
  purpose: false
});

function clearTooltip(field) {
  showDropdownTooltip.value[field] = false;
}

const smokingOptions = ref([
  { value: 'non-smoker', label: 'Non-smoker' },
  { value: 'social-smoker', label: 'Social smoker' },
  { value: 'light-smoker', label: 'Light smoker' },
  { value: 'moderate-smoker', label: 'Moderate smoker' },
  { value: 'heavy-smoker', label: 'Heavy smoker' }
]);

const alcoholOptions = ref([
  { value: 'non-drinker', label: 'Non-drinker' },
  { value: 'social-drinker', label: 'Social drinker' },
  { value: 'light-drinker', label: 'Light drinker' },
  { value: 'moderate-drinker', label: 'Moderate drinker' },
  { value: 'heavy-drinker', label: 'Heavy drinker' }
]);

const sexualOrientationOptions = ref([
  { value: 'Heterosexual', label: 'Heterosexual' },
  { value: 'Homosexual', label: 'Homosexual' },
  { value: 'Bisexual', label: 'Bisexual' },
  { value: 'Other', label: 'Other' }
]);

const purposeOptions = ref([
  { value: 'Dating', label: 'Meet new people' },
  { value: 'Friendship', label: 'Looking for a casual relationship' },
  { value: 'Long-term Relationship', label: 'Looking for a serious relationship' }
]);

const dropdownOpen = reactive({
  smoking: false,
  alcohol: false,
  sexualOrientation: false,
  purpose: false
});

const toggleDropdown = (key) => {
  dropdownOpen[key] = !dropdownOpen[key];
};

const selectOption = (key, option) => {
  if (key === 'smoking') smoking.value = option.value;
  else if (key === 'alcohol') alcohol.value = option.value;
  else if (key === 'sexualOrientation') sexualOrientation.value = option.value;
  else if (key === 'purpose') purpose.value = option.value;

  dropdownOpen[key] = false;
  clearTooltip(key);
};

const selectedSmokingLabel = computed(() =>
  smokingOptions.value.find(opt => opt.value === smoking.value)?.label || 'Select Smoking Status'
);
const selectedAlcoholLabel = computed(() =>
  alcoholOptions.value.find(opt => opt.value === alcohol.value)?.label || 'Select Alcohol Consumption'
);
const selectedSexualOrientationLabel = computed(() =>
  sexualOrientationOptions.value.find(opt => opt.value === sexualOrientation.value)?.label || 'Select Sexual Orientation'
);
const selectedPurposeLabel = computed(() =>
  purposeOptions.value.find(opt => opt.value === purpose.value)?.label || 'Select App Purpose'
);

const handleNext = async () => {
  showDropdownTooltip.value.smoking = !smoking.value;
  showDropdownTooltip.value.alcohol = !alcohol.value;
  showDropdownTooltip.value.sexualOrientation = !sexualOrientation.value;
  showDropdownTooltip.value.purpose = !purpose.value;

  const isValid = smoking.value && alcohol.value && sexualOrientation.value && purpose.value;

  if (!isValid) return;

  const user = auth.currentUser;
  if (!user) {
    console.error('No user is logged in');
    router.push({ name: 'Login' });
    return;
  }

  const dataToSave = {
    smoking: smoking.value,
    alcohol: alcohol.value,
    sexualOrientation: sexualOrientation.value,
    purpose: purpose.value
  };

  try {
    await setDoc(doc(db, 'users', user.uid), dataToSave, { merge: true });
    router.push({ name: 'NewUserPage3' });
  } catch (error) {
    console.error('Error saving profile details:', error);
  }
};
</script>

<style scoped>
.user-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.info-form {
  width: 50vw;
  max-width: 50vw;
  min-width: 40vw;
  height: 80vh;
  background: white;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  text-align: center;
}

.info-form h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: black;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.text-field {
  margin-bottom: 15px;
  position: relative;
  width: 100%;
  max-width: 400px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 13px;
}

.custom-picker label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  text-align: left;
  color: black;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
}

.dropdown-options {
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-top: 5px;
  background: white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
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
  align-self: center;
  padding: 12px;
  background: #ffe96b;
  color: black;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  width: 100%;
  max-width: 400px;
  cursor: pointer;
  transition: background 0.3s ease;
  box-sizing: border-box;
  margin-top: 20px;
}

button:hover {
  color: white;
}

.dropdown-tooltip {
  color: red;
  margin-top: 6px;
  font-size: 14px;
  font-weight: bold;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #fff0f0;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ffc0c0;
}
</style>

