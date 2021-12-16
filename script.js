const category_select = document.getElementById("category");
const difficulty_select = document.getElementById("difficulty");
const info_box = document.querySelector(".info_box");
const quiz_box = document.querySelector(".quiz_box");
const result_box = document.querySelector(".result_box");
const question_title = document.querySelector(".quiz_box header .title");
const question_text = document.querySelector(".que_text");
const option_list = document.querySelector(".option_list");
const next_btn = document.querySelector("footer .next_btn");
const bottom_ques_counter = document.querySelector("footer .total_que");
const timeCount = document.querySelector(".timer .timer_sec");

let questions = [];
let Category = {
  any: "Any Category",
  9: "General Knowledge",
  10: "Entertainment: Books",
  11: "Entertainment: Film",
  12: "Entertainment: Music",
  13: "Entertainment: Musicals Theatres",
  14: "Entertainment: Television",
  15: "Entertainment: Video Games",
  16: "Entertainment: Board Games",
  17: "Science: ComputersScience Nature",
  18: "Science: Computers",
  19: "Science: Mathematics",
  20: "Mythology",
  21: "Sports",
  22: "Geography",
  23: "History",
  24: "Politics",
  25: "Art",
  26: "Celebrities",
  27: "Animals",
  28: "Vehicles",
  29: "Entertainment: Comics",
  30: "Science: Gadgets",
  31: "Entertainment: Japanese Anime Manga",
  32: "Entertainment: Cartoon Animations",
};

let Difficulty = {
  any: "Any Difficulty",
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

let selectedCategory = "any";
let selectedDifficulty = "any";
let timeValue = 15;
let questionCount = 0;
let questionNumber = 1;
let counter;
let userScore = 0;

function selectCategory() {
  selectedCategory = category_select.value;
}

function selectDifficulty() {
  selectedDifficulty = difficulty_select.value;
}

function loadCategoryOptions() {
  let option_category = "";
  debugger;
  for (var key in Category) {
    option_category =
      option_category + `<option value=${key}>${Category[key]}</option>`;
  }

  category_select.innerHTML = option_category;
}

function loadDifficultyOptions() {
  let option_difficulty = "";
  for (var key in Difficulty) {
    option_difficulty =
      option_difficulty + `<option value=${key}>${Difficulty[key]}</option>`;
  }

  difficulty_select.innerHTML = option_difficulty;
}

document.addEventListener("DOMContentLoaded", function () {
  loadCategoryOptions();
  loadDifficultyOptions();
});

async function GetQuestions() {
  const category =
    selectedCategory != "any" ? `&category=${selectedCategory}` : "";
  const difficulty =
    selectedDifficulty != "any" ? `&difficulty=${selectedDifficulty}` : "";
  const url = `https://opentdb.com/api.php?amount=5${category}${difficulty}&type=multiple`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (response.ok && data.results && data.results.length > 0) {
      data.results.forEach((element, index) => {
        let options = element.incorrect_answers;
        options.push(element.correct_answer);
        const question = {
          numb: index + 1,
          question: element.question,
          answer: element.correct_answer,
          options: options.slice().sort(() => Math.random() - 0.5),
        };
        questions.push(question);
      });
      return true;
    } else {
      alert(
        "An error has occurred while preparing your quiz, please try again"
      );
      return false;
    }
  } catch (error) {
    console.log("error", error);
    alert("Oops! something went wrong, please check your internet and retry!");
    return false;
  }
}

async function Quiz() {
  debugger;
  const isQuizReady = await GetQuestions();
  // hide info box and show quiz box after getting questions
  if (isQuizReady) {
    info_box.classList.remove("activeInfo");
    quiz_box.classList.add("activeQuiz");
    showQuestions(0);
    questionCounter(1);
    startTimer(timeValue);
  }
}

function exitQuiz() {
  window.location.reload();
}

function showQuestions(index) {
  let option_tag = "";

  const currentQuestion = questions[index];

  let question_tag = `<span>${currentQuestion.numb} .${currentQuestion.question}</span>`;
  currentQuestion.options.forEach((option) => {
    option_tag =
      option_tag + `<div class="option"><span>${option}</span></div>`;
  });

  question_title.innerHTML = `<p>Question : ${currentQuestion.numb}</p>`;
  question_text.innerHTML = question_tag;
  option_list.innerHTML = option_tag;

  const optionNodeList = option_list.querySelectorAll(".option");

  // set onclick attribute to all available options
  optionNodeList.forEach((element) => {
    element.setAttribute("onclick", "optionSelected(this)");
  });
}

function optionSelected(answer) {
  clearInterval(counter);
  let userAnswer = answer.textContent;
  let correctAnswer = questions[questionCount].answer;
  const allOptions = option_list.children.length;

  if (userAnswer == correctAnswer) {
    console.log("Correct Answer");
    userScore += 1;
    answer.classList.add("correct");
  } else {
    console.log("Wrong Answer");
    answer.classList.add("incorrect");

    // check for the correct answer and add green color to it
    for (i = 0; i < allOptions; i++) {
      if (option_list.children[i].textContent == correctAnswer) {
        console.log("Auto selected correct answer.");
        option_list.children[i].setAttribute("class", "option correct");
      }
    }
  }

  //once user select an option then disabled all options
  for (i = 0; i < allOptions; i++) {
    option_list.children[i].classList.add("disabled");
  }
  //show the next button if user selected any option
  next_btn.classList.add("show");
}

function nextQuestion() {
  //if question count is less than total question length
  if (questionCount < questions.length - 1) {
    // show next question
    questionCount++;
    questionNumber++;
    showQuestions(questionCount);
    questionCounter(questionNumber);
    // restart the counter and hide next button for next question
    clearInterval(counter);
    startTimer(timeValue);
    next_btn.classList.remove("show");
  } else {
    // show results
    console.log("show result");
    clearInterval(counter);
    showResult();
  }
}

function startTimer(time) {
  debugger;
  timeCount.style.backgroundColor = "#007bff";
  counter = setInterval(timer, 1000);
  function timer() {
    timeCount.textContent = time;
    time--;
    //if timer is less than 9 we add 0 just for good display
    if (time < 9) {
      let addZero = timeCount.textContent;
      timeCount.textContent = `0${addZero}`;
    }
    //timeoff and user didnt answer
    if (time < 0) {
      timeCount.style.backgroundColor = "#FF0000";
      timeCount.textContent = "Time Off";
      clearInterval(counter);
      const allOptions = option_list.children.length;
      let correctAnswer = questions[questionCount].answer;

      // check for the correct answer and add green color ti it
      for (i = 0; i < allOptions; i++) {
        if (option_list.children[i].textContent == correctAnswer) {
          console.log("Time Off: Auto selected correct answer.");
          option_list.children[i].setAttribute("class", "option correct");
        }
      }

      //once user select an option then disabled all options
      for (i = 0; i < allOptions; i++) {
        option_list.children[i].classList.add("disabled");
      }
      //show the next button for next question
      next_btn.classList.add("show");
    }
  }
}

function questionCounter(index) {
  // increment the counter of questions
  let totalQueCounTag = `<span><p> ${index} </p> of <p> ${questions.length} </p> Questions</span>`;
  bottom_ques_counter.innerHTML = totalQueCounTag;
}

function showResult() {
  //show result box and hide all the others
  info_box.classList.remove("activeInfo");
  quiz_box.classList.remove("activeQuiz");
  result_box.classList.add("activeResult");
  const scoreText = result_box.querySelector(".score_text");
  const progress = result_box.querySelector(".progress");
  let scoreTag = `<span>You got <p> ${userScore} </p> out of <p> ${
    questions.length
  }</p> ,your score is <p> ${userScore * 20} / 100 </p></span>`;
  scoreText.innerHTML = scoreTag;
  progress.value = userScore;
}
