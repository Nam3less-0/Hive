import { getFirestore, collection, getDocs } from "firebase/firestore";

const db = getFirestore();

export async function fetchGlobalInterests() {
  const interestsSnapshot = await getDocs(collection(db, "interests"));
  return interestsSnapshot.docs.map(doc => doc.data().name);
}

export async function fetchAllUsers() {
  const usersSnapshot = await getDocs(collection(db, "users"));
  return usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export function encodeInterests(userInterests, globalInterests) {
  return globalInterests.map(interest => userInterests.includes(interest) ? 1 : 0);
}

export function cosineSimilarity(vecA, vecB, boost = 1.5) {
    let dot = 0;
    let magA = 0;
    let magB = 0;
  
    for (let i = 0; i < vecA.length; i++) {
      const a = vecA[i];
      const b = vecB[i];
  
      // Boost shared interest match
      const weight = (a === 1 && b === 1) ? boost : 1;
  
      dot += a * b * weight;
      magA += a * a;
      magB += b * b;
    }
  
    return dot / (Math.sqrt(magA) * Math.sqrt(magB) || 1);
  }

export async function getSimilarUsers(currentUserId) {
  const [globalInterests, allUsers] = await Promise.all([
    fetchGlobalInterests(),
    fetchAllUsers()
  ]);

  const currentUser = allUsers.find(u => u.id === currentUserId);
  const others = allUsers.filter(u => u.id !== currentUserId);

  const currentVec = encodeInterests(currentUser.interests, globalInterests);

  const similarities = others.map(u => {
    const vec = encodeInterests(u.interests, globalInterests);
    return {
      id: u.id,
      name: u.name,
      similarity: cosineSimilarity(currentVec, vec),
    };
  });

  return similarities.sort((a, b) => b.similarity - a.similarity);
}
