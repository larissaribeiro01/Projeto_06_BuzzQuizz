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
    console.log(quiz)
    const perguntas = quiz.questions;
    console.log(perguntas[0].answers)
    const perguntaDiv = document.querySelector(".conteudo-quiz")
    for(let i = 0; i< perguntas.length; i++){
        const respostas = perguntas[i].answers;
        perguntaDiv.innerHTML += `
        <div class="container-pergunta">
            <div class="box-texto" style="background-color:${perguntas[i].color};">
                <span>${perguntas[i].title}</span>
            </div>
            <div class="box-opcoes">
                <div class="opcao">
                    <img src="${respostas[0].text}" alt=""><span class="texto-opcao">r${respostas[0].text}</span>
                </div>
                <div class="opcao">
                     <img src="${respostas[1].text}" alt=""><span class="texto-opcao">${respostas[1].text}</span>
                 </div>
                <div class="opcao">
                    <img src="${respostas[2].text}" alt=""><span class="texto-opcao">${respostas[2].text}</span>
                </div>
                <div class="opcao">
                    <img src="${respostas[3].text}" alt=""><span class="texto-opcao">${respostas[3].text}</span>
                </div>
            </div>
        </div>`
    }
    
}
function embaralhar() {

}
