// === Persistent Storage for Entries ===
let entries = JSON.parse(localStorage.getItem('graceDiaryEntries')) || [];

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements after they are loaded
  const diaryEntry = document.getElementById('diaryEntry');
  const saveBtn = document.getElementById('saveBtn');
  const entriesList = document.getElementById('entriesList');
  const moodSpans = document.querySelectorAll('.moods span');
  const dateDisplay = document.getElementById('date');
  const memoriesToggle = document.getElementById('memoriesToggle');
  const memoriesSidebar = document.getElementById('memoriesSidebar');

  // Initialize variables
  let currentMood = null;

  // Set today's date
  dateDisplay.textContent = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Fix sidebar - ensure it's properly set up for toggling
  memoriesSidebar.style.display = 'block'; // Always display in DOM
  memoriesSidebar.style.right = '-350px'; // Initially positioned off-screen
  memoriesSidebar.style.transition = 'right 0.3s ease-out'; // Ensure the transition property is set

  // Mood Selection
  moodSpans.forEach(span => {
    span.addEventListener('click', () => {
      currentMood = span.getAttribute('data-mood');
      moodSpans.forEach(s => {
        s.style.opacity = '0.5';
        s.classList.remove('selected');
      });
      span.style.opacity = '1';
      span.classList.add('selected');
      
      // Create heart animation on mood selection
      createHeart(span.getBoundingClientRect().left, span.getBoundingClientRect().top);
    });
  });

  // Save Entry
  saveBtn.addEventListener('click', () => {
    if (!diaryEntry.value.trim()) {
      alert("Write something first!");
      return;
    }

    if (!currentMood) {
      alert("Select your mood!");
      return;
    }

    const newEntry = {
      date: new Date().toISOString(),
      text: diaryEntry.value,
      mood: currentMood
    };

    entries.push(newEntry);
    localStorage.setItem('graceDiaryEntries', JSON.stringify(entries));
    renderEntries();
    diaryEntry.value = '';
    currentMood = null;
    moodSpans.forEach(s => {
      s.style.opacity = '0.5';
      s.classList.remove('selected');
    });
    
    // Create heart burst animation
    createHeartBurst(saveBtn);
    
    alert("Saved successfully! 💖");
  });

  // Toggle Memories Sidebar - FIXED FUNCTION
  memoriesToggle.addEventListener('click', function() {
    // Get computed style to check the actual value
    const sidebarStyle = window.getComputedStyle(memoriesSidebar);
    const currentRight = sidebarStyle.right;
    
    // Check if sidebar is visible (accounting for potential px suffix)
    const isHidden = currentRight === '-350px' || currentRight === '-350px';
    
    if (isHidden) {
      // Show sidebar
      memoriesSidebar.style.right = '0px';
      memoriesToggle.textContent = '✕'; // Change icon to 'X'
    } else {
      // Hide sidebar
      memoriesSidebar.style.right = '-350px';
      memoriesToggle.textContent = '💖'; // Change back to heart
    }
  });

  // Initial render
  renderEntries();
  addKawaiiEnhancements();
  
  // Ensure button events work properly on mobile
  document.body.addEventListener('touchstart', function() {}, {passive: true});
});

// Render Past Entries
function renderEntries() {
  const entriesList = document.getElementById('entriesList');
  if (!entriesList) return;
  
  entriesList.innerHTML = entries.map((entry, index) => `
    <div class="entry" data-id="${index}">
      <div>
        <span class="entry-mood">${getMoodEmoji(entry.mood)}</span>
        <span class="entry-date">
          ${new Date(entry.date).toLocaleDateString()}
        </span>
        <button class="delete-btn" onclick="deleteEntry(${index})">✕</button>
      </div>
      <p>${entry.text}</p>
    </div>
  `).reverse().join('');
  
  // Fix delete buttons alignment
  const deleteButtons = document.querySelectorAll('.delete-btn');
  deleteButtons.forEach(btn => {
    btn.style.display = 'inline-flex';
    btn.style.justifyContent = 'center';
    btn.style.alignItems = 'center';
  });
}

// Delete entry function
function deleteEntry(index) {
  if (confirm("Are you sure you want to delete this entry?")) {
    entries.splice(index, 1); // Remove the entry
    localStorage.setItem('graceDiaryEntries', JSON.stringify(entries)); // Update storage
    renderEntries(); // Refresh the list
  }
}

// Get mood emoji
function getMoodEmoji(mood) {
  const emojis = {
    happy: '😊',
    loved: '🥰',
    sad: '😢',
    angry: '😠',
    tired: '😴'
  };
  return emojis[mood] || '❓';
}

// Kawaii Elements and Animations
function addKawaiiEnhancements() {
  addKawaiiElements();
  createSparkles();
  addSaveButtonEffect();
}

// Add kawaii decoration elements
function addKawaiiElements() {
  const container = document.querySelector('.container');
  if (!container) return;
  
  // Add bunny decoration
  const bunny = document.createElement('div');
  bunny.className = 'kawaii-decoration bunny-decoration';
  bunny.textContent = '🐰';
  container.appendChild(bunny);
  
  // Add cat decoration
  const cat = document.createElement('div');
  cat.className = 'kawaii-decoration cat-decoration';
  cat.textContent = '🐱';
  container.appendChild(cat);
  
  // Add rainbow separator after header
  const header = document.querySelector('header');
  if (header) {
    const rainbowSeparator = document.createElement('div');
    rainbowSeparator.className = 'rainbow-separator';
    header.after(rainbowSeparator);
  }
  
  // Add pastel dot pattern overlay
  const pastelDots = document.createElement('div');
  pastelDots.className = 'pastel-dots';
  document.body.appendChild(pastelDots);
}

// Create sparkling effect
function createSparkles() {
  const container = document.querySelector('.container');
  if (!container) return;
  
  // Reduce number of sparkles on mobile
  const isMobile = window.innerWidth <= 768;
  const interval = isMobile ? 600 : 300;
  
  setInterval(() => {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    
    // Random position within container
    const rect = container.getBoundingClientRect();
    const x = Math.random() * rect.width;
    const y = Math.random() * rect.height;
    
    sparkle.style.left = (rect.left + x) + 'px';
    sparkle.style.top = (rect.top + y) + 'px';
    
    // Random color
    const colors = ['#ffccd5', '#ff6b8b', '#f8bbd0', '#9e6b8b', '#c9184a'];
    sparkle.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    document.body.appendChild(sparkle);
    
    // Remove sparkle from DOM after animation
    setTimeout(() => {
      if (sparkle.parentNode) {
        sparkle.remove();
      }
    }, 1500);
  }, interval);
}

// Add sparkle effect to save button
function addSaveButtonEffect() {
  const saveBtn = document.getElementById('saveBtn');
  if (!saveBtn) return;
  
  saveBtn.addEventListener('mouseover', () => {
    createSparklesAround(saveBtn);
  });
  
  // Add touch support for mobile
  saveBtn.addEventListener('touchstart', () => {
    createSparklesAround(saveBtn);
  }, {passive: true});
}

// Create sparkles around an element
function createSparklesAround(element) {
  if (!element) return;
  
  const rect = element.getBoundingClientRect();
  
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const sparkle = document.createElement('div');
      sparkle.style.position = 'absolute';
      sparkle.style.width = '8px';
      sparkle.style.height = '8px';
      sparkle.style.borderRadius = '50%';
      sparkle.style.backgroundColor = '#fff';
      sparkle.style.boxShadow = '0 0 10px #fff, 0 0 20px #fff';
      sparkle.style.pointerEvents = 'none';
      sparkle.style.zIndex = '1000';
      
      // Position around the element
      const posX = rect.left + Math.random() * rect.width;
      const posY = rect.top + Math.random() * rect.height;
      
      sparkle.style.left = posX + 'px';
      sparkle.style.top = posY + 'px';
      
      // Animate
      sparkle.style.animation = 'sparkle 0.8s forwards';
      
      document.body.appendChild(sparkle);
      
      // Remove from DOM after animation
      setTimeout(() => {
        if (sparkle.parentNode) {
          sparkle.remove();
        }
      }, 800);
    }, i * 100);
  }
}

// Create floating heart animation
function createHeart(x, y) {
  const heart = document.createElement('div');
  heart.className = 'heart';
  heart.style.left = (x - 10) + 'px';
  heart.style.top = y + 'px';
  
  // Random heart colors and characters
  const hearts = ['💖', '💗', '💓', '💕', '💝', '💘', '❤️'];
  heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
  
  document.body.appendChild(heart);
  
  // Remove heart from DOM after animation ends
  setTimeout(() => {
    if (heart.parentNode) {
      heart.remove();
    }
  }, 4000);
}

// Create heart burst effect
function createHeartBurst(element) {
  if (!element) return;
  
  const rect = element.getBoundingClientRect();
  const hearts = ['💖', '💕', '💓', '💗', '💘'];
  
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      const heart = document.createElement('div');
      heart.style.position = 'fixed';
      heart.style.fontSize = '20px';
      heart.style.userSelect = 'none';
      heart.style.pointerEvents = 'none';
      heart.style.zIndex = '1000';
      
      // Random heart emoji
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      
      // Position at button
      const x = rect.left + rect.width/2;
      const y = rect.top;
      
      heart.style.left = (x - 10 + (Math.random() * 40 - 20)) + 'px';
      heart.style.top = (y - 10) + 'px';
      
      // Animation properties
      heart.style.animation = 'heart-float 3s ease-out forwards';
      
      // Add keyframes for heart float animation if not already in stylesheet
      if (!document.querySelector('#heart-animation-style')) {
        const style = document.createElement('style');
        style.id = 'heart-animation-style';
        style.innerHTML = `
          @keyframes heart-float {
            0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
            100% { transform: translate(${Math.random() * 100 - 50}px, -100px) rotate(${Math.random() * 90}deg); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }
      
      document.body.appendChild(heart);
      
      // Remove from DOM after animation
      setTimeout(() => {
        if (heart.parentNode) {
          heart.remove();
        }
      }, 3000);
    }, i * 100);
  }
}

// Handle window resize for better responsiveness
window.addEventListener('resize', function() {
  // Adjust sidebar position if it's open
  const memoriesSidebar = document.getElementById('memoriesSidebar');
  const memoriesToggle = document.getElementById('memoriesToggle');
  
  if (memoriesSidebar && memoriesToggle) {
    // Get computed style to check the actual value
    const sidebarStyle = window.getComputedStyle(memoriesSidebar);
    const currentRight = sidebarStyle.right;
    
    if (currentRight === '0px') {
      // If sidebar is open, adjust toggle button position
      const sidebarWidth = memoriesSidebar.offsetWidth;
      memoriesToggle.style.right = (sidebarWidth + 20) + 'px';
    } else {
      // Reset toggle position when sidebar is closed
      memoriesToggle.style.right = '20px';
    }
  }
});