document.getElementById('startGame').addEventListener('click', startGame);

let currentQuestionIndex = 0;
let score = 0;
let questions = [];

function fetchQuestions() {
    return fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            questions = data;
        });
}

function startGame() {
    fetchQuestions().then(() => {
        score = 0;
        currentQuestionIndex = 0;
        document.getElementById('score').innerText = 'Score: 0';
        document.getElementById('result').innerText = '';
        document.getElementById('startGame').classList.add('hidden');
        displayQuestion();
    });
}

function displayQuestion() {
    const questionData = questions[currentQuestionIndex];
    const allOptions = shuffle([questionData.answer, ...questionData.incorrectAnswers]);

    document.getElementById('question').innerText = questionData.question;
    document.getElementById('options').innerHTML = allOptions.map((option, index) => `
        <div>
            <input type="radio" name="option" id="option${index}" value="${option}">
            <label for="option${index}">${option}</label>
        </div>
    `).join('');

    document.getElementById('questionContainer').classList.remove('hidden');
    document.getElementById('nextQuestion').classList.add('hidden');
    document.getElementById('result').innerText = '';

    document.querySelectorAll('input[name="option"]').forEach(option => {
        option.addEventListener('click', checkAnswer);
    });
}

function checkAnswer(event) {
    const userAnswer = event.target.value;
    const questionData = questions[currentQuestionIndex];

    if (userAnswer.toLowerCase() === questionData.answer.toLowerCase()) {
        score += 1;
        document.getElementById('result').innerText = 'Correct!';
        document.getElementById('result').classList.add('correct');
        document.getElementById('result').classList.remove('incorrect');
    } else {
        document.getElementById('result').innerText = `Incorrect. The correct answer was: ${questionData.answer}`;
        document.getElementById('result').classList.add('incorrect');
        document.getElementById('result').classList.remove('correct');
    }

    document.getElementById('score').innerText = `Score: ${score}`;
    document.getElementById('nextQuestion').classList.remove('hidden');
    document.querySelectorAll('input[name="option"]').forEach(option => {
        option.disabled = true;
    });
}

document.getElementById('nextQuestion').addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        document.getElementById('questionContainer').classList.add('hidden');
        document.getElementById('result').innerText = `Game over! Your final score is ${score}.`;
        document.getElementById('startGame').classList.remove('hidden');
    }
});

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
