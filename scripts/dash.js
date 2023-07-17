const quizContainer = document.getElementById('quizContainer');
let URL = "http://localhost:8080"
let email = JSON.parse(localStorage.getItem("email")) || ""


renderQuizzes()
// Function to fetch and render all quizzes
async function renderQuizzes() {
    try {
        fetch(`${URL}/quiz`)
            .then(async (res) => {
                try {
                    let data = await res.json()
                    return { data, status: res.status }
                } catch (error) {
                    console.log(error)
                    alert("Check Console for Error")
                }
            })
            .then((res) => {
                if (res.status == 201) {
                    Card(res.data)
                }
            })
            .catch((err) => {
                console.log(err)
            })

        function Card(quizzes) {
            quizContainer.innerHTML = '';

            quizzes.forEach((quiz) => {
                const card = document.createElement('div');
                card.classList.add('card');

                const title = document.createElement('h2');
                title.textContent = `${quiz.title}`;

                const description = document.createElement('p');
                description.textContent = `${quiz.description}`;

                const creator = document.createElement('p');
                creator.textContent = `Created by: ${quiz.creator}`;
                creator.classList.add("bold")

                const numQuestions = document.createElement('p');
                numQuestions.textContent = `Questions: ${quiz.questions.length}`;
                numQuestions.classList.add("bold")

                const buttonDiv = document.createElement('div');
                buttonDiv.classList.add("buttonDiv")


                card.appendChild(title);
                card.appendChild(description);
                card.appendChild(creator);
                card.appendChild(numQuestions);

                if (quiz.creator != email) {
                    const takeQuizButton = document.createElement('button');
                    takeQuizButton.classList.add("take")
                    takeQuizButton.textContent = 'Take Quiz';
                    takeQuizButton.addEventListener('click', () => {
                        window.location.href = `/quiz/${quiz._id}`;
                    });

                    const leaderboardButton = document.createElement('button');
                    leaderboardButton.classList.add("leader")
                    leaderboardButton.textContent = 'Leaderboard';
                    leaderboardButton.addEventListener('click', () => {
                        window.location.href = `/quiz/${quiz._id}/leaderboard`;
                    });

                    buttonDiv.appendChild(takeQuizButton);
                    buttonDiv.appendChild(leaderboardButton);
                } else {
                    const editQuizButton = document.createElement('button');
                    editQuizButton.classList.add("edit")
                    editQuizButton.textContent = 'Edit';
                    editQuizButton.addEventListener('click', () => {
                        Edit(quiz._id, quiz.title, quiz.description)
                    });

                    const DelButton = document.createElement('button');
                    DelButton.classList.add("del")
                    DelButton.textContent = 'Delete';
                    DelButton.addEventListener('click', () => {
                        Delete(quiz._id)
                    });

                    buttonDiv.appendChild(editQuizButton);
                    buttonDiv.appendChild(DelButton);
                }

                card.appendChild(buttonDiv);
                quizContainer.appendChild(card);
            });
        }

    } catch (error) {
        console.error('Error fetching quizzes:', error);
    }
}


// ......................Create Quiz...............................

let create = document.getElementById("create")

create.addEventListener("click", () => {
    document.querySelector(".container").style = "block"
})


const createQuizButton = document.getElementById('createQuizButton');
const createQuizForm = document.getElementById('createQuizForm');
const questionsContainer = document.getElementById('questionsContainer');

// Function to add question fields
function addQuestionFields() {
    const numQuestions = parseInt(document.getElementById('numQuestions').value);

    questionsContainer.innerHTML = '';

    for (let i = 0; i < numQuestions; i++) {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');

        const questionTitleLabel = document.createElement('label');
        questionTitleLabel.textContent = `Question ${i + 1}:`;
        const questionTitleInput = document.createElement('input');
        questionTitleInput.type = 'text';
        questionTitleInput.id = `questionTitle-${i}`;
        questionTitleInput.placeholder = 'Enter question title';
        questionTitleInput.required = true;

        const answerOptionsLabel = document.createElement('label');
        answerOptionsLabel.textContent = 'Answer Options (comma-separated):';
        const answerOptionsInput = document.createElement('input');
        answerOptionsInput.type = 'text';
        answerOptionsInput.id = `answerOptions-${i}`;
        answerOptionsInput.placeholder = 'Enter answer options';
        answerOptionsInput.required = true;

        const correctOptionsLabel = document.createElement('label');
        correctOptionsLabel.textContent = 'Correct Options (comma-separated):';
        const correctOptionsInput = document.createElement('input');
        correctOptionsInput.type = 'text';
        correctOptionsInput.id = `correctOptions-${i}`;
        correctOptionsInput.placeholder = 'Enter correct options';
        correctOptionsInput.required = true;

        questionDiv.appendChild(questionTitleLabel);
        questionDiv.appendChild(questionTitleInput);
        questionDiv.appendChild(answerOptionsLabel);
        questionDiv.appendChild(answerOptionsInput);
        questionDiv.appendChild(correctOptionsLabel);
        questionDiv.appendChild(correctOptionsInput);

        questionsContainer.appendChild(questionDiv);
    }
}

// Function to create a new quiz
async function createQuiz(event) {
    event.preventDefault();

    const creator = document.getElementById('creator').value;
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const numQuestions = parseInt(document.getElementById('numQuestions').value);

    const questions = [];

    for (let i = 0; i < numQuestions; i++) {
        const questionTitle = document.getElementById(`questionTitle-${i}`).value;
        const answerOptions = document.getElementById(`answerOptions-${i}`).value.split(',');
        const correctOptions = document.getElementById(`correctOptions-${i}`).value.split(',').map(Number);

        questions.push({
            title: questionTitle,
            answerOptions: answerOptions,
            correctOptions: correctOptions,
        });
    }

    const quizData = {
        creator: creator,
        title: title,
        description: description,
        questions: questions,
        leaderboard: []
    };

    try {
        fetch(`${URL}/quiz`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(quizData),
        })
            .then(async (res) => {
                try {
                    let data = await res.json()
                    return { data, status: res.status }
                } catch (error) {
                    console.log(error)
                    alert("Check Console for Error")
                }
            })
            .then((res) => {
                console.log(res)
                if (res.status == 201) {
                    alert(res.data.msg)
                    window.location.reload()
                } else {
                    alert(res.data.msg)
                }
            })
            .catch((err) => {
                console.log(err)
            })

    } catch (error) {
        alert('Error creating quiz:Check Console');
        console.log(error)
    }
}

createQuizButton.addEventListener('click', createQuiz);

document.getElementById('numQuestions').addEventListener('change', addQuestionFields);



// .....................Delete Function .....................

function Delete(id) {
    let result = window.confirm("Do You really Want to Delete this Quiz?")
    if (result) {
        fetch(`${URL}/quiz/${id}`,{
            method:"DELETE"
        })
            .then(async (res) => {
                try {
                    let data = await res.json()
                    return { data, status: res.status }
                } catch (error) {
                    console.log(error)
                    alert("Check Console for Error")
                }
            })
            .then((res) => {
                if (res.status == 201) {
                    alert(res.data.msg)
                    window.location.reload()
                } else {
                    alert(res.data.msg)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

}

// ................Edit ........................

// Function to render the edit form for a quiz
function Edit(quizId, title, description) {
    const editForm = document.createElement('form');
    editForm.classList.add('edit-form');
    
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.value = title;
  
    const descriptionTextarea = document.createElement('textarea');
    descriptionTextarea.textContent = description;
  
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.addEventListener('click', async () => {
      const updatedTitle = titleInput.value;
      const updatedDescription = descriptionTextarea.value;
  
      try {
        const response = await fetch(`/api/quiz/${quizId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title: updatedTitle, description: updatedDescription }),
        });
  
        if (response.ok) {
          alert('Quiz updated successfully');
          renderQuizzes();
        } else {
          console.error('Failed to update quiz:', response.status);
        }
      } catch (error) {
        console.error('Error updating quiz:', error);
      }
    });
  
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', () => {
      renderQuizzes();
    });
  
    editForm.appendChild(titleInput);
    editForm.appendChild(descriptionTextarea);
    editForm.appendChild(saveButton);
    editForm.appendChild(cancelButton);
  
    quizContainer.innerHTML = '';
    quizContainer.appendChild(editForm);
  }