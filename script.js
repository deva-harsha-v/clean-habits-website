function showModule(id) {
  const modules = document.querySelectorAll('.module');
  modules.forEach(mod => mod.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}



const faqAnswers = {
  "how to prevent mosquitoes": "Drain stagnant water every 2–3 days, clean your drains, and cover all water tanks.",
  "how to segregate waste": "Use a green bin for wet waste and blue bin for dry waste. Avoid mixing food and plastic.",
  "what to do with plastic": "Clean and collect plastic separately. Give to authorized recyclers or local scrap vendors.",
  "what is swachh bharat": "Swachh Bharat is a government initiative to improve sanitation and eliminate open defecation.",
  "open garbage problem": "Use covered bins. Request your panchayat to install community bins if they are missing.",
  "how to keep surroundings clean": "Don’t litter, join community cleanups, and educate your neighbors about waste disposal.",
  "what is e-waste": "Electronic waste like old phones, batteries, or chargers. Give them to proper recycling centers."
};

function getFAQResponse() {
  const input = document.getElementById("chatInput").value.toLowerCase().trim();
  const chatBox = document.getElementById("chatBox");

  if (input === "") return;

  // Append user's question
  chatBox.innerHTML += `<div><strong>You:</strong> ${input}</div>`;

  // Check for known answers
  let response = faqAnswers[input] || "Sorry, I don’t have an answer for that. Try asking something related to cleanliness or environment.";

  // Append chatbot's response
  setTimeout(() => {
    chatBox.innerHTML += `<div><strong>Bot:</strong> ${response}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 500);

  // Clear input
  document.getElementById("chatInput").value = "";
}

function handleEnter(event) {
  if (event.key === "Enter") {
    getFAQResponse();
  }
}


async function fetchWeather() {
  const weatherInfo = document.getElementById('weather-info');
  const healthTip = document.getElementById('health-tip');

  if (!navigator.geolocation) {
    weatherInfo.textContent = "Geolocation is not supported by your browser.";
    return;
  }

  navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    try {
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`);
      const data = await response.json();

      const temp = data.current.temperature_2m;
      const code = data.current.weather_code;
      const condition = getWeatherCondition(code);

      weatherInfo.innerHTML = `📍 <strong>Temperature:</strong> ${temp}°C<br><strong>Condition:</strong> ${condition}`;

      // Custom health advice
      let tip = "Maintain good hygiene and drink clean water.";
      if (condition.includes("Rain")) {
        tip = "It's rainy! Keep your surroundings dry, use covered bins, and check for mosquito breeding.";
      } else if (condition.includes("Clear")) {
        tip = "Perfect day! Dry your clothes in the sun and clean outdoor spaces.";
      } else if (condition.includes("Cloudy")) {
        tip = "Cloudy weather – keep drains and water tanks covered.";
      } else if (condition.includes("Snow")) {
        tip = "It's snowing! Keep yourself warm and ensure water pipelines aren't frozen.";
      }

      healthTip.innerHTML = `🩺 <strong>Health Tip:</strong> ${tip}`;

    } catch (error) {
      weatherInfo.textContent = "Error fetching weather.";
    }
  }, () => {
    weatherInfo.textContent = "Unable to access location.";
  });
}

function getWeatherCondition(code) {
  const weatherCodes = {
    0: "Clear Sky",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing Rime Fog",
    51: "Light Drizzle",
    53: "Moderate Drizzle",
    55: "Dense Drizzle",
    61: "Light Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    71: "Light Snow",
    73: "Moderate Snow",
    75: "Heavy Snow",
    95: "Thunderstorm"
  };
  return weatherCodes[code] || "Unknown";
}

// Call weather fetch on load
window.onload = () => {
  fetchWeather();
};

function checkQuiz() {
  const answers = {
    q1: "c",
    q2: "a",
    q3: "b",
    q4: "a",
    q5: "a",
    q6: "b",
    q7: "b"
  };

  let score = 0;
  let total = Object.keys(answers).length;

  for (let q in answers) {
    const selected = document.querySelector(`input[name="${q}"]:checked`);
    if (selected && selected.value === answers[q]) {
      score++;
    }
  }

  const resultDiv = document.getElementById("quizResult");
  const sound = document.getElementById("celebrateSound");

  if (score === total) {
    resultDiv.innerHTML = `✅ Excellent! You scored ${score}/${total}. You’re a clean surroundings champ! 🏆`;
    resultDiv.style.color = "#00e676";
    
    // Play sound
    sound.play();

    // Trigger confetti
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#00e676', '#00c853', '#b2ff59']
    });

  } else if (score >= total / 2) {
    resultDiv.innerHTML = `👍 Good Job! You scored ${score}/${total}. Try again for full marks!`;
    resultDiv.style.color = "#ffa726";
  } else {
    resultDiv.innerHTML = `⚠️ You scored ${score}/${total}. Let’s work together for cleaner surroundings!`;
    resultDiv.style.color = "#ef5350";
  }
}
