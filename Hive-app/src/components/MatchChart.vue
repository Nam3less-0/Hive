<template>
    <div class="match-chart-container">
      <canvas ref="matchChartCanvas"></canvas>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { Chart, registerables } from 'chart.js';
  import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';
  import { getApp } from 'firebase/app';
  import { getAuth } from 'firebase/auth';
  
  Chart.register(...registerables);
  
  export default {
    name: 'MatchChart',
    setup() {
      const matchChartCanvas = ref(null);
      const db = getFirestore(getApp());
      const auth = getAuth();
      const chartInstance = ref(null);
  
      const getPast7Days = () => {
        const days = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const label = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
          days.push({ label, date, count: 0 });
        }
        return days;
      };
  
      const updateChart = (labels, data) => {
        if (chartInstance.value) {
          chartInstance.value.data.labels = labels;
          chartInstance.value.data.datasets[0].data = data;
          chartInstance.value.update();
        } else {
          chartInstance.value = new Chart(matchChartCanvas.value, {
            type: 'line',
            data: {
              labels,
              datasets: [{
                label: 'Matches (last 7 days)',
                data,
                fill: false,
                tension: 0.3,
                borderColor: '#facc15',
                backgroundColor: '#facc15',
                pointBackgroundColor: '#facc15',
                pointBorderColor: '#000',
                pointRadius: 5
              }]
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                  display: true,
                  labels: {
                    font: {
                      family: "'Segoe UI', 'Poppins', 'Helvetica Neue', sans-serif",
                      size: 14
                    },
                    color: '#444'
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                    precision: 0,
                    font: {
                      family: "'Segoe UI', 'Poppins', 'Helvetica Neue', sans-serif",
                      size: 12
                    },
                    color: '#333',
                    callback: value => Number.isInteger(value) ? value : null
                  },
                  title: {
                    display: true,
                    text: 'Number of Matches',
                    font: {
                      family: "'Segoe UI', 'Poppins', 'Helvetica Neue', sans-serif",
                      size: 14
                    },
                    color: '#333'
                  }
                },
                x: {
                  ticks: {
                    font: {
                      family: "'Segoe UI', 'Poppins', 'Helvetica Neue', sans-serif",
                      size: 12
                    },
                    color: '#333'
                  },
                  title: {
                    display: true,
                    text: 'Date',
                    font: {
                      family: "'Segoe UI', 'Poppins', 'Helvetica Neue', sans-serif",
                      size: 14
                    },
                    color: '#333'
                  }
                }
              }
            }
          });
        }
      };
  
      const startListeningForMatches = () => {
        const currentUser = auth.currentUser;
        const currentUserId = currentUser?.uid;
  
        if (!currentUserId) {
          console.warn('No current user ID available.');
          return;
        }
  
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);
  
        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999);
  
        const matchesRef = collection(db, 'matches');
        const q = query(matchesRef, where('matchedAt', '>=', startDate), where('matchedAt', '<=', endDate));
  
        onSnapshot(q, (querySnapshot) => {
          const past7Days = getPast7Days();
  
          querySnapshot.forEach(doc => {
            const data = doc.data();
            const userIds = data.userIds || [];
  
            if (!userIds.includes(currentUserId)) return;
  
            const matchedAt = data.matchedAt?.toDate?.() || new Date(data.matchedAt);
            matchedAt.setHours(0, 0, 0, 0);
  
            for (const day of past7Days) {
              const dayDate = new Date(day.date);
              dayDate.setHours(0, 0, 0, 0);
              if (matchedAt.getTime() === dayDate.getTime()) {
                day.count++;
              }
            }
          });
  
          updateChart(past7Days.map(d => d.label), past7Days.map(d => d.count));
        });
      };
  
      onMounted(() => {
        startListeningForMatches();
      });
  
      return { matchChartCanvas };
    }
  };
  </script>
  
  
  <style scoped>
  .match-chart-container {
    font-family: 'Segoe UI', 'Poppins', 'Helvetica Neue', sans-serif;
    background-color: #fff8e1;
    border: 2px solid #fbc02d;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    padding: 15px;
    font-size: 1.2rem;
    margin: 10px auto;
    max-width: 100%;
    height: 250px;
    pointer-events: none;
  }
  
  canvas {
    width: 100% !important;
    height: 100% !important;
    max-height: 220px;
  }
  
  .chart-title {
    font-weight: bold;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin-bottom: 8px;
    font-size: 1.2rem;
    color: #333;
  }
  </style>
  
  