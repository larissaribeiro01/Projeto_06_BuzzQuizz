quizzes=[]
quizzSelecionado=[]
acessarApi();

function acessarApi () {
    const promise=axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes');
    promise.then(carregarDados); 

}

function carregarDados (response) {
    quizzes=response.data;
    adcQuizzes ();
    
}

function adcQuizzes () {
    for (let i=0; i<quizzes.length; i++) {
        document.querySelector(".quizzes").innerHTML+=`<div>
        <img src="${quizzes[i].image}" onclick="selecionarQuizz(${i})">
        <h3>${quizzes[i].title}</h3>
    </div>`
    }
    

}

function selecionarQuizz(i) {
    document.querySelector(".tela1").classList.add('escondido')
    document.querySelector(".tela2").classList.remove('escondido')
    quizzSelecionado=quizzes[i]    
}


function selecionarResposta (i, j) {
    setInterval(function () {
        document.querySelector("."+question[i+1]).scrollIntoView();
    }, 2000)
    numRespostas=quizzSelecionado.questions[i].answers.length
    for (let y=0; y<numRespostas; y++) {
        if (y!=j) {
            document.querySelector("."+questions[i].answers[y]).classList.add('naoSelecionada')
        }
    }
    if (quizzSelecionado.questions[i].answers[j].isCorrectAnswer) {
        document.querySelector("."+questions[i].answers[j]).classList.add('respostaCerta')
    } else {
        document.querySelector(elemento).classList.add('respostaErrada')
    }
    
}