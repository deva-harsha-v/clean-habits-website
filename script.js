// ── Module Navigation ──
function showModule(id, btn) {
  // Hide all modules
  document.querySelectorAll('.module').forEach(m => m.classList.remove('active'));
  // Deactivate all nav buttons
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  // Show target
  const target = document.getElementById(id);
  if (target) target.classList.add('active');

  // Activate button
  if (btn) {
    btn.classList.add('active');
  } else {
    // fallback: find button by data-label or index
    document.querySelectorAll('.nav-btn').forEach(b => {
      if (b.getAttribute('onclick') && b.getAttribute('onclick').includes(`'${id}'`)) {
        b.classList.add('active');
      }
    });
  }

  // Close mobile sidebar
  closeSidebar();

  // Scroll top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Sidebar (mobile) ──
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('visible');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('visible');
}

// ── Quiz Progress ──
function updateProgress() {
  const total = 7;
  let answered = 0;
  for (let i = 1; i <= total; i++) {
    if (document.querySelector(`input[name="q${i}"]:checked`)) answered++;
  }
  document.getElementById('quizProgressFill').style.width = `${(answered / total) * 100}%`;
  document.getElementById('quizProgressLabel').textContent = `${answered} / ${total} answered`;
}

// ── Quiz Submit ──
function checkQuiz() {
  const answers = { q1: 'c', q2: 'a', q3: 'b', q4: 'a', q5: 'a', q6: 'b', q7: 'b' };
  const total = Object.keys(answers).length;
  let score = 0;

  for (const q in answers) {
    const selected = document.querySelector(`input[name="${q}"]:checked`);
    if (selected && selected.value === answers[q]) score++;
  }

  const resultDiv = document.getElementById('quizResult');
  resultDiv.classList.remove('hidden', 'perfect', 'good', 'low');

  if (score === total) {
    resultDiv.innerHTML = `🏆 Perfect Score! You got ${score}/${total}. You're a clean surroundings champion!`;
    resultDiv.classList.add('perfect');
    document.getElementById('celebrateSound')?.play().catch(() => {});
    confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 }, colors: ['#3ddc84','#2ab36a','#b2ff59'] });
  } else if (score >= Math.ceil(total / 2)) {
    resultDiv.innerHTML = `👍 Good job! You scored ${score}/${total}. Try again to get full marks!`;
    resultDiv.classList.add('good');
  } else {
    resultDiv.innerHTML = `⚠️ You scored ${score}/${total}. Keep learning — cleaner surroundings start with awareness!`;
    resultDiv.classList.add('low');
  }

  resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ── Weather ──
async function fetchWeather() {
  const weatherInfo = document.getElementById('weather-info');
  const healthTip   = document.getElementById('health-tip');
  const loading     = document.getElementById('weatherLoading');

  if (!navigator.geolocation) {
    loading.textContent = 'Geolocation is not supported by your browser.';
    return;
  }

  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude: lat, longitude: lon } = position.coords;
    try {
      const res  = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`);
      const data = await res.json();
      const temp = data.current.temperature_2m;
      const condition = getWeatherCondition(data.current.weather_code);

      loading.classList.add('hidden');
      weatherInfo.innerHTML = `📍 <strong>Temperature:</strong> ${temp}°C &nbsp;|&nbsp; <strong>Condition:</strong> ${condition}`;
      weatherInfo.classList.remove('hidden');

      let tip = 'Maintain good hygiene and drink clean water.';
      if (condition.includes('Rain') || condition.includes('Drizzle')) {
        tip = 'It\'s rainy! Keep your surroundings dry, use covered bins, and check for mosquito breeding spots.';
      } else if (condition.includes('Clear') || condition.includes('Mainly')) {
        tip = 'Perfect day! Dry your clothes in the sun and clean outdoor spaces around your home.';
      } else if (condition.includes('Cloudy') || condition.includes('Overcast')) {
        tip = 'Cloudy weather – keep drains and water tanks covered to prevent contamination.';
      } else if (condition.includes('Snow')) {
        tip = 'It\'s snowing! Keep yourself warm and ensure water pipelines aren\'t frozen.';
      } else if (condition.includes('Thunder')) {
        tip = 'Thunderstorm alert! Stay indoors, avoid open spaces, and check for flooding near drains.';
      }

      healthTip.innerHTML = `🩺 <strong>Health Tip:</strong> ${tip}`;
      healthTip.classList.remove('hidden');
    } catch {
      loading.textContent = 'Error fetching weather data.';
    }
  }, () => {
    loading.textContent = 'Unable to access your location. Please allow location access.';
  });
}

function getWeatherCondition(code) {
  const map = {
    0:'Clear Sky', 1:'Mainly Clear', 2:'Partly Cloudy', 3:'Overcast',
    45:'Fog', 48:'Rime Fog',
    51:'Light Drizzle', 53:'Moderate Drizzle', 55:'Dense Drizzle',
    61:'Light Rain', 63:'Moderate Rain', 65:'Heavy Rain',
    71:'Light Snow', 73:'Moderate Snow', 75:'Heavy Snow',
    95:'Thunderstorm', 96:'Thunderstorm with Hail', 99:'Severe Thunderstorm'
  };
  return map[code] || 'Unknown';
}

// ── Init ──
window.addEventListener('DOMContentLoaded', () => {
  fetchWeather();
  // Show intro on load
  showModule('intro');
});
