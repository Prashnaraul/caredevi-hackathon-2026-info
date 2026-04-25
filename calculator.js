const data = JSON.parse(localStorage.getItem("nutritionUser"));
const results = document.getElementById("results");

let calories = 0;
let protein = 0;
let carbs = 0;
let fat = 0;
let score = 100;
let waterLiters = 0;

if (!data) {
  results.innerHTML = `
    <p>No data found. Please fill out the form first.</p>
    <button onclick="goBack()">Go to Form</button>
  `;
} else {
  const weight = Number(data.weight);
  const height = Number(data.height);
  const age = Number(data.age);
  const activity = Number(data.activity);

  let bmr =
    data.gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  calories = Math.round(bmr * activity);

  let goalMessage = "";

  if (data.goal === "lose") {
    calories -= 300;
    goalMessage =
      "Because your goal is weight loss, FuelMate creates a small calorie deficit. This means you still get energy for the day, but slightly less than your body burns, which can support gradual progress.";
  } else if (data.goal === "gain") {
    calories += 300;
    goalMessage =
      "Because your goal is muscle gain, FuelMate adds extra calories. Your body needs extra fuel to recover, build muscle, and avoid feeling weak after activity.";
  } else {
    goalMessage =
      "Because your goal is maintenance, FuelMate keeps your calories close to your daily energy needs. This helps you stay steady without intentionally gaining or losing weight.";
  }

  protein = Math.round(weight * 1.8);
  fat = Math.round((calories * 0.25) / 9);
  carbs = Math.round((calories - (protein * 4 + fat * 9)) / 4);

  waterLiters = ((weight * 35) / 1000).toFixed(1);

  if (calories < 1400) score -= 25;
  if (calories > 2800) score -= 15;
  if (protein < weight * 1.2) score -= 25;
  if (fat < 30) score -= 10;
  if (carbs < 100) score -= 10;
  if (score < 0) score = 0;

  const scoreMessage =
    score >= 85
      ? "Strong balance"
      : score >= 65
      ? "Good start, but can improve"
      : "Needs attention";

  let riskText = "";

  if (calories < 1400) {
    riskText += "⚠️ Your calorie target is very low. This may lead to low energy, tiredness, or difficulty focusing.<br>";
  }

  if (protein < weight * 1.2) {
    riskText += "⚠️ Your protein may be low. Low protein can make recovery harder and may leave you hungry sooner.<br>";
  }

  if (calories > 2800) {
    riskText += "⚠️ Your calorie target is high. This can be okay for active people, but portion control and movement matter.<br>";
  }

  if (riskText === "") {
    riskText = "✅ No major risk detected from this basic estimate. Your plan looks reasonable based on your inputs.";
  }

  results.innerHTML = `
    <div class="score-box">
      <h2>⭐ Health Score: ${score}/100</h2>
      <p>${scoreMessage}</p>
      <p>
        This score is a simple readiness check based on calories, protein, carbs, and fats.
        It helps you quickly understand whether your plan looks balanced.
      </p>
    </div>

    <div class="result-box">
      <h2>🔥 ${calories} Calories/day</h2>
      <p>
        Calories are your body’s daily fuel. You need them for walking, studying,
        working, exercising, and even basic body functions like breathing and thinking.
      </p>

      <div class="macro-education">
        <div>
          <h3>💪 Protein: ${protein}g</h3>
          <p>
            Protein helps repair muscles and keeps you full.
            Good sources: dal, eggs, chicken, fish, yogurt, paneer, chickpeas, lentils.
          </p>
        </div>

        <div>
          <h3>🍚 Carbs: ${carbs}g</h3>
          <p>
            Carbs are your main energy source.
            Good sources: rice, roti, chiura, oats, potatoes, fruits, and grain-based meals.
          </p>
        </div>

        <div>
          <h3>🥑 Fats: ${fat}g</h3>
          <p>
            Fats support hormones, brain health, and long-lasting energy.
            Good sources: nuts, peanuts, seeds, eggs, milk, avocado, and healthy oils.
          </p>
        </div>
      </div>
    </div>

    <div class="risk-box">
      <h3>⚠️ Risk Insight</h3>
      <p>${riskText}</p>
    </div>

    <div class="explain-box">
      <h3>🧠 Decision Explanation</h3>
      <p>${goalMessage}</p>
      <p>
        FuelMate estimates your needs using your age, height, weight, activity level,
        and goal. Instead of only showing numbers, it explains what those numbers mean
        and connects them to real food choices.
      </p>
    </div>

    <div class="culture-box">
      <h3>🌍 Culturally Adaptive Nutrition</h3>
      <p>
        FuelMate adapts to different dietary styles instead of forcing a single “perfect” diet.
        It supports South Asian, East Asian, African-inspired, and Western meal patterns.
      </p>
      <p>
        The goal is to make nutrition guidance realistic, familiar, and easier to follow
        across different communities.
      </p>
      <p>
        <strong>Key idea:</strong> Better nutrition is not about changing your culture,
        but improving balance within it.
      </p>
    </div>

    <p class="note">
      Note: FuelMate is for educational guidance only, not medical diagnosis.
    </p>
  `;

  createChart();
  waterReminder();
}

function createChart() {
  const chartElement = document.getElementById("macroChart");

  if (!chartElement) return;

  new Chart(chartElement, {
    type: "doughnut",
    data: {
      labels: ["Protein", "Carbs", "Fat"],
      datasets: [
        {
          data: [protein, carbs, fat]
        }
      ]
    },
    options: {
      plugins: {
        legend: {
          position: "bottom"
        }
      }
    }
  });
}

function waterReminder() {
  const box = document.getElementById("waterGoal");
  const hour = new Date().getHours();

  if (!box) return;

  let reminder = "";

  if (hour < 12) {
    reminder = "Try to finish about 40% of your water goal before lunch.";
  } else if (hour < 18) {
    reminder = "Try to reach about 70% of your water goal by evening.";
  } else {
    reminder = "Finish your remaining water slowly, but avoid drinking too much right before sleep.";
  }

  box.innerHTML = `
    Your estimated water goal is <strong>${waterLiters} liters/day</strong>.<br>
    ${reminder}
  `;
}

function mealReminder() {
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();
  const box = document.getElementById("mealReminder");

  if (!box) return;

  const currentTime = `${hour % 12 || 12}:${minute.toString().padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;

  if (hour >= 7 && hour < 10) {
    box.innerHTML = `
      <strong>Current time: ${currentTime}</strong><br>
      🌅 Breakfast window: 7:00 AM – 10:00 AM<br>
      Try: sel roti + boiled egg, chiya + roasted chana, or curd + chiura + banana.
    `;
  } else if (hour >= 12 && hour < 15) {
    box.innerHTML = `
      <strong>Current time: ${currentTime}</strong><br>
      🍛 Lunch window: 12:00 PM – 2:30 PM<br>
      Try a balanced plate with carbs, protein, and vegetables.
    `;
  } else if (hour >= 18 && hour < 21) {
    box.innerHTML = `
      <strong>Current time: ${currentTime}</strong><br>
      🌙 Dinner window: 6:00 PM – 9:00 PM<br>
      Choose a filling but not-too-heavy dinner with protein and vegetables.
    `;
  } else {
    box.innerHTML = `
      <strong>Current time: ${currentTime}</strong><br>
      🍌 Snack window<br>
      Try fruit, yogurt, peanuts, roasted chana, or a light balanced snack.
    `;
  }
}

function sleepReminder() {
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();
  const box = document.getElementById("sleepReminder");

  if (!box) return;

  const currentTime = `${hour % 12 || 12}:${minute.toString().padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;

  if (hour >= 21 || hour < 5) {
    box.innerHTML = `
      <strong>Current time: ${currentTime}</strong><br>
      🌙 Sleep window: 10:00 PM – 6:00 AM<br>
      Reduce screen time, avoid heavy meals, and prepare for rest.
    `;
  } else if (hour >= 5 && hour < 8) {
    box.innerHTML = `
      <strong>Current time: ${currentTime}</strong><br>
      🌅 Wake-up window: 6:00 AM – 8:00 AM<br>
      Drink water, move lightly, and eat breakfast within a few hours.
    `;
  } else if (hour >= 15 && hour < 18) {
    box.innerHTML = `
      <strong>Current time: ${currentTime}</strong><br>
      ☕ Afternoon reminder<br>
      Avoid too much caffeine now so your sleep is not disturbed later.
    `;
  } else {
    box.innerHTML = `
      <strong>Current time: ${currentTime}</strong><br>
      ✅ Sleep tip<br>
      Keep a consistent bedtime and avoid very heavy meals close to sleep.
    `;
  }
}

function goBack() {
  window.location.href = "form.html";
}

mealReminder();
sleepReminder();

setInterval(mealReminder, 60000);
setInterval(sleepReminder, 60000);
setInterval(waterReminder, 60000);
