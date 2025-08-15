<template>
  <div class="not-available-page">
    <div class="container">
      <div class="row">
        <div class="col-sm-12 col-md-12 mt-5 mb-5">
          <!-- Animated 404 SVG -->
          <div class="error-content">
            <svg 
              ref="errorSvgRef"
              width="100%" 
              height="auto" 
              viewBox="0 0 400 200" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              class="floating-error"
            >
              <!-- 4 -->
              <g class="digit-swing">
                <path d="M20 50 L20 100 L50 100 L50 50 L50 150 L80 150 L80 100 L80 50 L50 50" 
                      stroke="url(#errorGradient)" 
                      stroke-width="8" 
                      fill="none" 
                      stroke-linecap="round"/>
              </g>
              
              <!-- 0 -->
              <g class="zero-complex">
                <ellipse cx="150" cy="100" rx="40" ry="60" 
                         stroke="url(#errorGradient)" 
                         stroke-width="8" 
                         fill="none"/>
              </g>
              
              <!-- 4 -->
              <g class="digit-swing-reverse">
                <path d="M220 50 L220 100 L250 100 L250 50 L250 150 L280 150 L280 100 L280 50 L250 50" 
                      stroke="url(#errorGradient)" 
                      stroke-width="8" 
                      fill="none" 
                      stroke-linecap="round"/>
              </g>

              <!-- Floating particles -->
              <g class="particles">
                <circle cx="320" cy="60" r="3" fill="url(#particleGradient)" class="particle-1"/>
                <circle cx="340" cy="80" r="2" fill="url(#particleGradient)" class="particle-2"/>
                <circle cx="360" cy="40" r="4" fill="url(#particleGradient)" class="particle-3"/>
                <circle cx="380" cy="120" r="2" fill="url(#particleGradient)" class="particle-4"/>
              </g>

              <defs>
                <linearGradient id="errorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#E8D197"/>
                  <stop offset="50%" stop-color="#FEF5DA"/>
                  <stop offset="100%" stop-color="#2F1829"/>
                </linearGradient>
                <radialGradient id="particleGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#FEF5DA"/>
                  <stop offset="100%" stop-color="#E8D197"/>
                </radialGradient>
              </defs>
            </svg>

            <!-- Error message -->
            <div class="error-message" ref="messageRef">
              <h1 class="error-title">Page Not Available</h1>
              <p class="error-description">
                The page you're looking for is currently not accessible. 
                It might be under maintenance or temporarily unavailable.
              </p>
              
              <!-- Action buttons -->
              <div class="action-buttons">
                <button @click="goHome" class="btn-primary floating-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9,22 9,12 15,12 15,22"/>
                  </svg>
                  Go Home
                </button>
                
                <button @click="goBack" class="btn-secondary floating-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="15,18 9,12 15,6"/>
                  </svg>
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Background decoration -->
    <div class="bg-decoration">
      <div class="floating-shape shape-1"></div>
      <div class="floating-shape shape-2"></div>
      <div class="floating-shape shape-3"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const errorSvgRef = ref<SVGElement | null>(null)
const messageRef = ref<HTMLElement | null>(null)

const goHome = () => {
  window.location.href = '/'
}

const goBack = () => {
  window.history.back()
}

onMounted(() => {
  console.log('Page Not Available component mounted')
  
  if (messageRef.value) {
    setTimeout(() => {
      messageRef.value?.classList.add('animate-in')
    }, 500)
  }
})
</script>

<style scoped>

.not-available-page {
  background: radial-gradient(at 50% -20%, #2F1829, #141019) fixed;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  color: #FEF5DA;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
  position: relative;
  z-index: 10;
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -15px;
}

.col-sm-12 {
  position: relative;
  width: 100%;
  padding: 0 15px;
}

.mt-5, .mb-5 {
  margin-top: 3rem;
  margin-bottom: 3rem;
}

.error-content {
  text-align: center;
}

.floating-error {
  animation: floating 3s ease-in-out infinite;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3));
  max-width: 400px;
  margin: 0 auto 2rem;
  opacity: 0;
  animation: floating 3s ease-in-out infinite, fade-in 1s ease-in forwards;
}

@keyframes floating {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.digit-swing {
  animation: swing 2s ease-in-out infinite alternate;
  transform-origin: center;
  transform-box: fill-box;
}

.digit-swing-reverse {
  animation: swing-reverse 2s ease-in-out infinite alternate;
  transform-origin: center;
  transform-box: fill-box;
}

.zero-complex {
  transform-origin: center;
  transform-box: fill-box;
  animation: zero-complex 4s ease-in-out infinite;
}

@keyframes swing {
  0% { transform: rotate(-5deg) scale(1); }
  100% { transform: rotate(5deg) scale(1.1); }
}

@keyframes swing-reverse {
  0% { transform: rotate(5deg) scale(1.1); }
  100% { transform: rotate(-5deg) scale(1); }
}

@keyframes zero-complex {
  0% { 
    transform: scale(1) rotateY(0deg);
  }
  25% { 
    transform: scale(1.2) rotateY(90deg);
  }
  50% { 
    transform: scale(1.4) rotateY(180deg);
  }
  75% { 
    transform: scale(1.2) rotateY(270deg);
  }
  100% { 
    transform: scale(1) rotateY(360deg);
  }
}

.particles .particle-1 { animation: particle-float 3s ease-in-out infinite; }
.particles .particle-2 { animation: particle-float 2.5s ease-in-out infinite 0.5s; }
.particles .particle-3 { animation: particle-float 3.5s ease-in-out infinite 1s; }
.particles .particle-4 { animation: particle-float 2s ease-in-out infinite 1.5s; }

@keyframes particle-float {
  0%, 100% { transform: translateY(0px) scale(1); opacity: 0.7; }
  50% { transform: translateY(-20px) scale(1.2); opacity: 1; }
}

.error-message {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease-out;
}

.error-message.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.error-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #FEF5DA, #E8D197);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: title-glow 2s ease-in-out infinite alternate;
}

@keyframes title-glow {
  0% { filter: drop-shadow(0 0 10px rgba(254, 245, 218, 0.3)); }
  100% { filter: drop-shadow(0 0 20px rgba(254, 245, 218, 0.6)); }
}

.error-description {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  color: rgba(254, 245, 218, 0.8);
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.floating-btn {
  padding: 12px 24px;
  border-radius: 50px;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  text-decoration: none;
  animation: button-float 3s ease-in-out infinite;
}

.btn-primary {
  background: linear-gradient(135deg, #FEF5DA, #E8D197);
  color: #2F1829;
  box-shadow: 0 4px 15px rgba(254, 245, 218, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 20px rgba(254, 245, 218, 0.4);
}

.btn-secondary {
  background: transparent;
  color: #FEF5DA;
  border: 2px solid #E8D197;
  box-shadow: 0 4px 15px rgba(232, 209, 151, 0.2);
}

.btn-secondary:hover {
  transform: translateY(-2px) scale(1.05);
  background: rgba(232, 209, 151, 0.1);
  box-shadow: 0 6px 20px rgba(232, 209, 151, 0.3);
}

@keyframes button-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-3px); }
}

.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(254, 245, 218, 0.1), rgba(232, 209, 151, 0.05));
  animation: shape-float 6s ease-in-out infinite;
}

.shape-1 {
  width: 100px;
  height: 100px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 60px;
  height: 60px;
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.shape-3 {
  width: 80px;
  height: 80px;
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

@keyframes shape-float {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg);
    opacity: 0.3;
  }
  50% { 
    transform: translateY(-30px) rotate(180deg);
    opacity: 0.6;
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .error-title {
    font-size: 2rem;
  }
  
  .error-description {
    font-size: 1rem;
    padding: 0 1rem;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .floating-btn {
    width: 200px;
    justify-content: center;
  }
  
  .mt-5, .mb-5 {
    margin-top: 2rem;
    margin-bottom: 2rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 10px;
  }
  
  .error-title {
    font-size: 1.8rem;
  }
  
  .floating-error {
    max-width: 300px;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .floating-error,
  .digit-swing,
  .digit-swing-reverse,
  .zero-complex,
  .particles circle,
  .floating-btn,
  .floating-shape {
    animation: none;
  }
  
  .error-message {
    opacity: 1;
    transform: none;
  }
  
  .floating-btn:hover {
    transform: none;
  }
}

/* Focus styles for accessibility */
.floating-btn:focus {
  outline: 2px solid #FEF5DA;
  outline-offset: 2px;
}

.floating-btn:focus:not(:focus-visible) {
  outline: none;
}
</style>