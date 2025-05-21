// Landing page functionality
document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const landingPage = document.getElementById('landing-page');
  const diaryPage = document.getElementById('diary-page');
  const enterDiaryBtn = document.getElementById('enter-diary-btn');
  const videoContainers = document.querySelectorAll('.video-container');
  const navBtns = document.querySelectorAll('.nav-btn');
  
  // Initialize the first video
  if (videoContainers[0]) {
    videoContainers[0].classList.add('active');
    if (videoContainers[0].querySelector('video')) {
      videoContainers[0].querySelector('video').play();
    }
  }
  
  // Auto carousel functionality
  let currentVideoIndex = 0;
  const totalVideos = videoContainers.length;
  
  function showVideo(index) {
    // Hide all videos
    videoContainers.forEach(container => {
      container.classList.remove('active');
      if (container.querySelector('video')) {
        container.querySelector('video').pause();
      }
    });
    
    // Remove active class from all nav buttons
    navBtns.forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Show selected video
    if (videoContainers[index]) {
      videoContainers[index].classList.add('active');
      if (videoContainers[index].querySelector('video')) {
        videoContainers[index].querySelector('video').play();
      }
    }
    
    // Update active nav button
    if (navBtns[index]) {
      navBtns[index].classList.add('active');
    }
    
    // Update current index
    currentVideoIndex = index;
  }
  
  // Auto rotate videos every 8 seconds
  const autoRotate = setInterval(() => {
    const nextIndex = (currentVideoIndex + 1) % totalVideos;
    showVideo(nextIndex);
  }, 8000);
  
  // Navigation button click handlers
  navBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const index = parseInt(this.getAttribute('data-index'));
      showVideo(index);
      
      // Create sparkle effect when clicking nav buttons
      createSparkleEffect(this);
      
      // Reset auto rotation
      clearInterval(autoRotate);
      setTimeout(() => {
        const nextAutoIndex = (index + 1) % totalVideos;
        showVideo(nextAutoIndex);
      }, 8000);
    });
  });
  
  // Enter diary button click handler
  enterDiaryBtn.addEventListener('click', function() {
    // Create heart burst effect
    createHeartBurst(this);
    
    // Fade out landing page
    landingPage.classList.add('landing-fade-out');
    
    // Display diary page after transition
    setTimeout(() => {
      landingPage.style.display = 'none';
      diaryPage.style.display = 'block';
      diaryPage.classList.add('diary-fade-in');
    }, 1500);
  });
  
  // Create sparkle effect
  function createSparkleEffect(element) {
    const rect = element.getBoundingClientRect();
    
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'absolute';
        sparkle.style.width = '8px';
        sparkle.style.height = '8px';
        sparkle.style.borderRadius = '50%';
        
        // Random sparkle color
        const colors = ['#ffccd5', '#ff6b8b', '#f8bbd0', '#fff', '#ffb6c1'];
        sparkle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        sparkle.style.boxShadow = '0 0 10px #fff, 0 0 20px #fff';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '2001';
        
        // Position around the element
        const posX = rect.left + (rect.width * Math.random());
        const posY = rect.top + (rect.height * Math.random());
        
        sparkle.style.left = posX + 'px';
        sparkle.style.top = posY + 'px';
        
        // Animate
        sparkle.style.animation = 'sparkle 1s forwards';
        
        document.body.appendChild(sparkle);
        
        // Remove from DOM after animation
        setTimeout(() => {
          if (sparkle.parentNode) {
            sparkle.remove();
          }
        }, 1000);
      }, i * 100);
    }
  }
  
  // Create heart burst effect
  function createHeartBurst(element) {
    const rect = element.getBoundingClientRect();
    const hearts = ['💖', '💕', '💓', '💗', '💘', '💝', '💞'];
    
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.style.position = 'fixed';
        heart.style.fontSize = '24px';
        heart.style.userSelect = 'none';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '2001';
        
        // Random heart emoji
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        
        // Position at button
        const x = rect.left + rect.width/2;
        const y = rect.top + rect.height/2;
        
        heart.style.left = (x - 12) + 'px';
        heart.style.top = (y - 12) + 'px';
        
        // Animation properties
        const angle = Math.random() * 360;
        const distance = 50 + Math.random() * 100;
        const duration = 1 + Math.random() * 2;
        
        heart.style.transition = `all ${duration}s ease-out`;
        
        document.body.appendChild(heart);
        
        // Trigger animation on next frame
        requestAnimationFrame(() => {
          heart.style.transform = `translate(${distance * Math.cos(angle)}px, ${distance * Math.sin(angle)}px) scale(${0.5 + Math.random()}) rotate(${Math.random() * 360}deg)`;
          heart.style.opacity = '0';
        });
        
        // Remove from DOM after animation
        setTimeout(() => {
          if (heart.parentNode) {
            heart.remove();
          }
        }, duration * 1000);
      }, i * 100);
    }
  }
  
  // Add hover animations to buttons
  const buttons = document.querySelectorAll('button');
  buttons.forEach(btn => {
    btn.addEventListener('mouseover', function() {
      createSparkleEffect(this);
    });
  });
  
  // Handle keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (landingPage.style.display !== 'none') {
      if (e.key === 'ArrowRight') {
        const nextIndex = (currentVideoIndex + 1) % totalVideos;
        showVideo(nextIndex);
      } else if (e.key === 'ArrowLeft') {
        const prevIndex = (currentVideoIndex - 1 + totalVideos) % totalVideos;
        showVideo(prevIndex);
      } else if (e.key === 'Enter') {
        enterDiaryBtn.click();
      }
    }
  });
  
  // Add touch swipe for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  }, false);
  
  document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, false);
  
  function handleSwipe() {
    if (landingPage.style.display !== 'none') {
      const swipeThreshold = 50;
      if (touchEndX < touchStartX - swipeThreshold) {
        // Swipe left
        const nextIndex = (currentVideoIndex + 1) % totalVideos;
        showVideo(nextIndex);
      } else if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe right
        const prevIndex = (currentVideoIndex - 1 + totalVideos) % totalVideos;
        showVideo(prevIndex);
      }
    }
  }
});