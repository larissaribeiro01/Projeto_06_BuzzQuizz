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
