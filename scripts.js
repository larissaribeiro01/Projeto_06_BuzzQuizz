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
    comecarQuiz(quizzSelecionado);
}
function comecarQuiz (quiz){
    const perguntas = quiz.questions;
    const perguntaDiv = document.querySelector(".conteudo-quiz")
    for(let i = 0; i< perguntas.length; i++){
        const respostas = perguntas[i].answers;
        respostas.sort(comparador);
        perguntaDiv.innerHTML += `
        <div class="container-pergunta">
            <div class="box-texto" style="background-color:${perguntas[i].color};">
                <span>${perguntas[i].title}</span>
            </div>
            <div class="box-opcoes"></div>
        </div>`
        for(let j = 0; j<respostas.length;j++){
            const todasRespostasDiv = document.querySelectorAll(".box-opcoes");
            todasRespostasDiv[i].innerHTML += `
            <div class="opcao">
                <img src="${respostas[j].image}" alt="" onclick="selecionarResposta(${i},${j})" class="imagem q${i} a${j}" ><span class="texto-opcao q${i} a${j}">${respostas[j].text}</span>
            </div>`
        }
    }
    
}
function comparador() {
    return Math.random() - 0.5;
}


function selecionarResposta (i, j) {
    next=i+1
    setTimeout(function () {
        document.querySelector(".q"+next).scrollIntoView();
    }, 2000)
    numRespostas=quizzSelecionado.questions[i].answers.length
    for (let y=0; y<numRespostas; y++) {
        if (y!=j) {
            document.querySelector(".imagem.q"+i+".a"+y).classList.add('naoSelecionada')
        }
    }
    for (let y=0; y<numRespostas; y++) {
        if (quizzSelecionado.questions[i].answers[y].isCorrectAnswer) {
            document.querySelector(".texto-opcao.q"+i+".a"+y).classList.add('respostaCerta')
        } else {
            document.querySelector(".texto-opcao.q"+i+".a"+y).classList.add('respostaErrada')
        }
    }
    
}