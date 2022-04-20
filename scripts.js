quizzes=[]
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
        <img src="${quizzes[i].image}">
        <h3>${quizzes[i].title}</h3>
    </div>`
    }
    

}

