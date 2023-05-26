const username = document.getElementById("username");
const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const question = document.getElementById("question");
const choicesList = document.getElementById("options");
const categories = document.getElementById("categories");

const apiKey = "NPTbn2dPH2SevJi7pNJ6zgiFLkSfCP8cLDqERaDA";
const baseURL = "https://quizapi.io/api/v1/questions";

let data;
var questionIndex = 0;
var answer;
var score = 0;
var categoryValue = "";
let isLoading = true;

const loading = (prop1, prop2) => {
  console.log("loading...");
  document.querySelector(".loader").classList.replace(prop1, prop2);
};

const quizApi = async () => {
  /**
   * check if loading is true
   * if true call loading function
   */
  isLoading && loading("d-none", "d-block");
  const res = await fetch(
    `${baseURL}?apiKey=${apiKey}&limit=20&category=${categoryValue}`
  );
  data = await res.json();
  isLoading = false;

  !isLoading && loading("d-block", "d-none");

  render();
};

const getCategory = () => {
  let selectedCategory = categories.options[categories.selectedIndex];
  categoryValue = selectedCategory.value;
};

categories.addEventListener("change", getCategory);

const scoreCard = () => {
  document.querySelector(".custom-card-container").classList.add("d-none");
  document.querySelector(".score-card").classList.replace("d-none", "d-block");
  document.getElementById("score").innerText = score;

  if (score >= 10) {
    document.getElementById("score-label").innerText = "Pass";
  } else {
    document.getElementById("score-label").innerText = "Failed";
  }
};

const render = () => {
  if (questionIndex >= data.length) {
    scoreCard();
    return;
  }

  question.innerText = data[questionIndex].question;
  const choices = data[questionIndex].answers;

  const correctAnswer = data[questionIndex].correct_answers;
  console.log(data[questionIndex]);

  document.getElementById("questions-count").innerText = `${
    questionIndex + 1
  } of ${data.length} Questions`;

  let options = "";
  for (let key in choices) {
    if (choices[key] === null) {
      continue;
    }
    options +=
      `<li class="choices-item" id="${key}"><span>` +
      choices[key] +
      "</span></li>";
  }

  choicesList.innerHTML = `${options}`;

  const choiceItems = document.querySelectorAll(".choices-item");
  choiceItems.forEach((item) => {
    item.addEventListener("click", function () {
      answer = this.id;

      choiceItems.forEach((item) => {
        item.classList.remove("bg-success");
        item.classList.remove("text-white");
      });

      item.classList.add("bg-success");
      item.classList.add("text-white");
    });
  });

  /**
   * check if the answer variable have a value
   * if answer is undefined don't call checkAnswer function
   */
  answer !== undefined && checkAnswer(answer, correctAnswer);
  questionIndex++;
};

const checkAnswer = (answer, correctAnswer) => {
  let correct;
  for (const key in correctAnswer) {
    if (correctAnswer.hasOwnProperty(key) && correctAnswer[key] === "true") {
      correct = key;
      break;
    }
  }

  if (answer.concat("_", "correct") === correct) {
    console.log("Your answer is correct!");
    score++;
  } else {
    console.log("Your answer is incorrect.");
  }
};

const startQuiz = () => {
  document
    .querySelector(".form-container")
    .classList.replace("d-flex", "d-none");
  document.querySelector(".custom-card").classList.replace("d-none", "d-block");

  quizApi();
};

document.getElementById("play-again").addEventListener("click", () => {
  window.location.reload();
});

nextBtn.addEventListener("click", render);

startBtn.addEventListener("click", startQuiz);
