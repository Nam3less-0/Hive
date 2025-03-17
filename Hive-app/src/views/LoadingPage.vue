<template>
    <div class="loader-container">
      <div class="loader-content">
        <img class="logo" src="@/assets/hive-logo.png" alt="Hive Logo" />
        <div class="dots-container">
          <div class="dots">
            <div class="dot" v-for="(_, index) in dots" :key="index"></div>
            <div class="bee" :style="beeStyle"></div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        dots: Array(5).fill(null),
        currentDot: 4,
        gap: 0,
        isBouncing: false
      };
    },
    computed: {
      beeStyle() {
        const horizontal = this.currentDot * this.gap;
        const vertical = this.isBouncing ? -25 : 0;
        return {
          transform: `translate(${horizontal}px, ${vertical}px)`
        };
      }
    },
    mounted() {
      this.calculateGap();
      this.animateBee();
      this.redirectAfterDelay();
      window.addEventListener('resize', this.calculateGap);
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.calculateGap);
    },
    methods: {
      calculateGap() {
        this.gap = Math.min(window.innerWidth / 20, 50);
      },
      animateBee() {
        setInterval(() => {
          this.isBouncing = true;
          setTimeout(() => (this.isBouncing = false), 250);
          this.currentDot = (this.currentDot == 0) ? 5: this.currentDot;
          this.currentDot = (this.currentDot - 1) % this.dots.length;
        }, 500);
      },
      redirectAfterDelay() {
        setTimeout(async () => {
          await import('@/views/Home.vue');
          this.$router.push({ name: 'Home' });
        }, 3000);
      }
    }
  };
  </script>
  
  <style scoped>
  .loader-container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 100vh;
    width: 100vw;
    background-image: url('@/assets/LoadingPage.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
  
  .loader-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 30%;
  }
  
  .logo {
    width: 20vw;
    max-width: 250px;
  }
  
  .dots-container {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  
  .dots {
    display: flex;
    position: relative;
  }
  .dot {
    width: 2vw;
    height: 2vw;
    background-color: rgba(0, 0, 0, 0.9);
    border-radius: 50%;
    margin: 0 1vw;
    max-width: 20px;
    max-height: 20px;
  }
  .bee {
    width: 3vw;
    height: 3vw;
    background-image: url('@/assets/Bee_Icon.png');
    background-size: contain;
    background-repeat: no-repeat;
    position: absolute;
    top: -4vw;
    left: 0;
    transition: transform 0.25s ease-in-out;
    max-width: 32px;
    max-height: 32px;
  }
  
  /* Bee trail effect */
  .bee::after {
    content: '';
    width: 1vw;
    height: 1vw;
    background-color: transparent;
    border-radius: 50%;
    border: 2px dotted rgba(0, 0, 0, 0.8);
    position: absolute;
    bottom: -1.5vw;
    left: 50%;
    transform: translateX(-50%);
    animation: fadeTrail 0.5s ease-out infinite;
    max-width: 8px;
    max-height: 8px;
  }
  
  @keyframes fadeTrail {
    from { opacity: 0.8; transform: translateY(0); }
    to { opacity: 0; transform: translateY(1.5vw); }
  }
  </style>