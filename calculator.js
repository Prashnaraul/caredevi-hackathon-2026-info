const data = JSON.parse(localStorage.getItem("nutritionUser"));
const results = document.getElementById("results");

let calories = 0;
let protein = 0;
let carbs = 0;
let fat = 0;
let score = 100;

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
    goalMessage = "Your goal is weight loss, so FuelMate creates a small calorie deficit.";
  } else if (data.goal === "gain") {
    calories += 300;
    goalMessage = "Your goal is muscle gain, so FuelMate adds extra calories for recovery and growth.";
  } else {
    goalMessage = "Your goal is maintenance, so FuelMate keeps your calories near your daily needs.";
  }

  protein = Math.round(weight * 1.8);
  fat = Math.round((calories * 0.25) / 9);
  carbs = Math.round((calories - (protein * 4 + fat * 9)) / 4);

  // HEALTH SCORE
  if (calories < 1400) score -= 25;
  if (calories > 2800) score -= 15;
  if (protein < weight * 1.2) score -= 25;
  if (fat < 30) score -= 10;
  if (carbs < 100) score -= 10;
  if (score < 0) score = 0;

  let scoreMessage =
    score >= 85
      ? "Strong balance"
      : score >= 65
      ? "Good start, but can improve"
      : "Needs attention";

  // RISK INSIGHT
  let riskText = "";

  if (calories < 1400) {
    riskText += "⚠️ Your calorie target is very low, which may cause tiredness, dizziness, or low focus.<br>";
  }

  if (protein < weight * 1.2) {
    riskText += "⚠️ Your protein may be low, which can affect muscle recovery and fullness.<br>";
  }

  if (calories > 2800) {
    riskText += "⚠️ Your calorie target is high, so portion control and activity are important.<br>";
  }

  if (riskText === "") {
    riskText = "✅ No major risk detected from this basic nutrition estimate.";
  }

  results.innerHTML = `
    <div class="score-box">
      <h2>⭐ Health Score: ${score}/100</h2>
      <p>${scoreMessage}</p>
    </div>

    <div class="result-box">
      <h2>🔥 ${calories} Calories/day</h2>
      <p>💪 <strong>Protein:</strong> ${protein}g</p>
      <p>🍚 <strong>Carbs:</strong> ${carbs}g</p>
      <p>🥑 <strong>Fat:</strong> ${fat}g</p>
    </div>

    <div class="risk-box">
      <h3>⚠️ Risk Insight</h3>
      <p>${riskText}</p>
    </div>

    <div class="explain-box">
      <h3>🧠 Why this plan?</h3>
      <p>${goalMessage}</p>
      <p>
        FuelMate uses your age, height, weight, activity level, and goal to estimate your daily needs.
        Calories fuel your body, protein helps recovery, carbs give energy, and fats support brain and hormone health.
      </p>
    </div>

    <p class="note">
      Note: FuelMate is for educational guidance only, not medical diagnosis.
    </p>
  `;

  createChart();
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

function mealReminder() {
  const hour = new Date().getHours();
  const box = document.getElementById("mealReminder");

  if (!box) return;

  if (hour >= 6 && hour < 10) {
    box.innerHTML = "🌅 Breakfast time: try sel roti + boiled egg, chiya + roasted chana, or oats + banana.";
  } else if (hour >= 11 && hour < 15) {
    box.innerHTML = "🍛 Lunch time: dal bhat with vegetables, achar, and egg/chicken is a strong choice.";
  } else if (hour >= 17 && hour < 21) {
    box.innerHTML = "🌙 Dinner time: try dal bhat, momo soup, or rice + dal + greens.";
  } else {
    box.innerHTML = "🍌 Snack time: try peanuts, yogurt, fruit, or roasted chana.";
  }
}

function eatNow(type) {
  const box = document.getElementById("eatSuggestion");

  if (!box) return;

  if (type === "hungry") {
    box.innerHTML = `
      <h3>🍛 Balanced Nepali Meals</h3>
      <ul>
        <li>Dal bhat + tarkari + boiled egg</li>
        <li>Rice + dal + spinach + chicken</li>
        <li>Dhido + gundruk soup + egg</li>
      </ul>
    `;
  }

  if (type === "workout") {
    box.innerHTML = `
      <h3>💪 After Workout Meals</h3>
      <ul>
        <li>Banana + milk + boiled eggs</li>
        <li>Rice + chicken curry + vegetables</li>
        <li>Dal bhat + extra lentils + egg</li>
        <li>Curd + beaten rice + banana</li>
      </ul>
    `;
  }

  if (type === "energy") {
    box.innerHTML = `
      <h3>⚡ Low Energy Options</h3>
      <ul>
        <li>Chiya + roasted chana</li>
        <li>Curd + chiura + banana</li>
        <li>Sel roti + boiled egg</li>
        <li>Fruit + peanuts</li>
      </ul>
    `;
  }
}

function goBack() {
  window.location.href = "form.html";
}

mealReminder();
