const QUESTIONS = [
    {
        label: 'What approach do you use to improve your gaming performance?',
        answers: [
            'I follow a well-defined strategy tailored to each game.',
            'I adjust my tactics depending on the current game scenario.',
            'I mostly rely on my instincts without a fixed plan.',
            'I am still experimenting to find my ideal gaming style.',
        ],
    },
    {
        label: 'Which tools do you use for analyzing games and why?',
        answers: [
            'I focus on understanding game mechanics to enhance my skills.',
            'I analyze player behavior to anticipate opponents’ moves.',
            'I combine both game mechanics and player analysis for deeper insight.',
            'I prefer to play without formal analysis, enjoying the unpredictability.',
        ],
    },
    {
        label: 'How do you manage stress and focus during intense gaming sessions?',
        answers: [
            'I maintain discipline and stick to my gaming routine.',
            'Sometimes I feel pressured but work actively on staying calm.',
            'My emotions occasionally influence my decisions in play.',
            'I generally stay relaxed and unaffected by gaming pressure.',
        ],
    },
    {
        label: 'How do you evaluate your success in gaming?',
        answers: [
            'By consistently improving my gameplay and strategies.',
            'By the number of matches or levels I complete successfully.',
            'By reviewing my overall game performance and achievements.',
            'I focus more on enjoyment rather than tracking outcomes.',
        ],
    },
    {
        label: 'Do you plan your gaming sessions, and how strictly do you follow your plan?',
        answers: [
            'I create a detailed plan and adhere to it closely.',
            'I have a plan but allow flexibility when needed.',
            'I am developing a structured approach but it’s not fixed yet.',
            'I prefer spontaneous gaming sessions without strict plans.',
        ],
    },
];


const $container = document.getElementById('container');

const startStep = {
    render: () => {
        $container.innerHTML = `
        <div class="container quiz-wrapper">
            <div class="row quiz-content">
                <div class="col-lg-6 col-md-6 col-lg-6">
                    <img class="quiz-img" src="images/quiz.jpg">
                </div>
                <div class="col-lg-6 col-md-6 col-lg-6">
                    <h2 class="title">Test Your Gaming Expertise</h2>
                    <h3>Discover your knowledge of game mechanics, strategy development, competitive play, and immersive virtual worlds.</h3>
                    <button class="btn btn-primary py-3 first-button" data-action="startQuiz">Begin Quiz</button>
                </div>
            </div>
        </div>
        `;
    },
    onClick: (el) => {
        if (el.getAttribute('data-action') === 'startQuiz') {
            quiz.nextStep(questionsStep);
        }
    },
};

const questionsStep = {
    questionIndex: 0,
    answers: {},
    render: () => {
        const question = QUESTIONS[questionsStep.questionIndex];

        $container.innerHTML = `
        <div class="container quiz-wrapper">
            <div class="row quiz-content text-center">
                <h3>${question.label}</h3>
                <div class="row answers">
                    ${question.answers
                        .map(
                            (answer, index) =>
                                `<button class="answer col-md-12 col-lg-6 rounded" data-action="selectAnswer" data-answer-index="${index}">
                                    ${answer}
                                </button>`
                        )
                        .join('')}
                </div>
            </div>
        </div>
        `;
    },
    onClick: (el) => {
        switch (el.getAttribute('data-action')) {
            case 'selectAnswer':
                return questionsStep.selectAnswer(
                    parseInt(el.getAttribute('data-answer-index'), 10),
                );
        }
    },
    selectAnswer: (answerIndex) => {
        const question = QUESTIONS[questionsStep.questionIndex];
        const selectedAnswer = question.answers[answerIndex];

        questionsStep.answers = {
            ...questionsStep.answers,
            [question.label]: selectedAnswer,
        };

        if (questionsStep.isFinalQuestion()) {
            questionsStep.completeStep();
        } else {
            questionsStep.goToNextQuestion();
        }
    },
    isFinalQuestion: () => questionsStep.questionIndex === QUESTIONS.length - 1,
    goToNextQuestion: () => {
        questionsStep.questionIndex += 1;
        questionsStep.render();
    },
    completeStep: () => {
        quiz.setAnswers(questionsStep.answers);
        quiz.nextStep(finalStep);
    },
};

const finalStep = {
    render: () => {
        $container.innerHTML = `
       <div class="container quiz-wrapper">
            <div class="row quiz-content">
                <div class="col-lg-6 col-md-6 col-sm-12">
                    <h2 class="title">Gaming Skills Assessment</h2>
                    <h3>Complete the form to get your complimentary guide on game tactics and strategies!</h3>
                    <form>
                        <input class="form-control" name="name" type="text" placeholder="Your Name" required>
                        <input class="form-control" name="email" id="email2" type="email" placeholder="Your Email" required>
                        <div id="validation" style="color: red"></div>
                        <input class="form-control" name="phone" type="tel" id="phone" placeholder="Contact Number" required>
                        
                        <input name="gameMechanics" value="Game Mechanics" hidden>
                        <input name="strategyDevelopment" value="Strategy Development" hidden>
                        <input name="competitivePlay" value="Competitive Play" hidden>
                        <input name="virtualWorlds" value="Virtual Worlds" hidden>
                        <input name="gameAnalysis" value="Game Analysis" hidden>
                        
                        <button data-action="submitAnswers" class="btn btn-primary w-50 py-3">Submit</button>
                    </form>
                </div>
                <div class="col-lg-6 col-md-6 col-lg-6">
                    <img class="quiz-img" src="images/quiz-2.jpg">
                </div>
            </div>
        </div>

        `;
    },
    onClick: (el) => {
        if (el.getAttribute('data-action') === 'submitAnswers') {
            const emailInput = document.getElementById('email2').value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (emailRegex.test(emailInput)) {
                document.getElementById('validation').textContent = '';
                window.location.href = 'thanks.html';
                localStorage.setItem('quizDone', true);
                document.getElementById('quiz-page').classList.add('hide');
            } else {
                document.getElementById('validation').textContent =
                    'Invalid email address. Please enter a valid email.';
            }
        }
    },
};

const quiz = {
    activeStep: startStep,
    answers: {},
    clear: () => ($container.innerHTML = ''),
    init: () => {
        $container.addEventListener('click', (event) =>
            quiz.activeStep.onClick(event.target),
        );
        $container.addEventListener('submit', (event) =>
            event.preventDefault(),
        );
    },
    render: () => {
        quiz.clear();
        quiz.activeStep.render();
    },
    nextStep: (step) => {
        quiz.activeStep = step;
        quiz.render();
    },
    setAnswers: (answers) => (quiz.answers = answers),
};

if (!localStorage.getItem('quizDone')) {
    quiz.init();
    quiz.render();
}