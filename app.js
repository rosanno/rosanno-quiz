const username = document.getElementById("username");
const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const question = document.getElementById("question");
const choicesList = document.getElementById("options");

const apiKey = "NPTbn2dPH2SevJi7pNJ6zgiFLkSfCP8cLDqERaDA";
const baseURL = "https://quizapi.io/api/v1/questions";

let data;
var questionIndex = 0;
var answer;
var score = 0;

const quizApi = async () => {
  const res = await fetch(`${baseURL}?apiKey=${apiKey}&limit=10`);
  data = await res.json();
  render();
};

const render = () => {
  if (questionIndex >= data.length) {
    document.querySelector(".custom-card-container").classList.add("d-none");
    document.querySelector(".score-card").classList.remove("d-none");
    document.querySelector(".score-card").classList.add("d-block");
    document.getElementById("score").innerText = score;
    return;
  }

  question.innerText = data[questionIndex].question;
  const choices = data[questionIndex].answers;

  const correctAnswer = data[questionIndex].correct_answers;
  console.log(data[questionIndex]);

  document.getElementById("questions-count").innerText = `${
    questionIndex + 1
  } of ${data.length} Question`;

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
        item.classList.remove("selected");
      });

      item.classList.add("selected");
    });
  });

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
