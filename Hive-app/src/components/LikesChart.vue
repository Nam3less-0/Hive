<template>
  <div class="match-chart-container">
    <canvas ref="likesChartCanvas"></canvas>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

Chart.register(...registerables);

export default {
  name: 'LikesChart',
  setup() {
    const likesChartCanvas = ref(null);
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
        chartInstance.value = new Chart(likesChartCanvas.value, {
          type: 'line',
          data: {
            labels,
            datasets: [{
              label: 'Likes Received (last 7 days)',
              data,
              fill: false,
              tension: 0.3,
              borderColor: '#8bc34a',
              backgroundColor: '#8bc34a',
              pointBackgroundColor: '#8bc34a',
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
                  text: 'Number of Likes',
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

    const fetchLikesOver7Days = async () => {
      const currentUser = auth.currentUser;
      const currentUserId = currentUser?.uid;
      if (!currentUserId) return;

      const past7Days = getPast7Days();

      const userRef = doc(db, 'users', currentUserId);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return;

      const likes = userSnap.data().likes || [];

      likes.forEach(({ timestamp }) => {
        const date = timestamp?.toDate?.() || new Date(timestamp);
        date.setHours(0, 0, 0, 0);

        for (const day of past7Days) {
          const dayDate = new Date(day.date);
          dayDate.setHours(0, 0, 0, 0);

          if (date.getTime() === dayDate.getTime()) {
            day.count++;
          }
        }
      });

      updateChart(past7Days.map(d => d.label), past7Days.map(d => d.count));
    };

    onMounted(() => {
      fetchLikesOver7Days();
    });

    return { likesChartCanvas };
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
