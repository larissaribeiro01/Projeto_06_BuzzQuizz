quizzes=[]
quizzSelecionado=[]
acessarApi();
let acertos=0;
let score=0;
let tituloQuiz;
let qtdsPerguntasQuiz;
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
    document.querySelector(".tela2").scrollIntoView(true)
    comecarQuiz(quizzSelecionado);
}
function comecarQuiz (quiz){
    const tituloQuiz = quiz.title;
    const tituloQuizDiv = document.querySelector(".topo-quiz span")
    tituloQuizDiv.innerHTML = tituloQuiz

    const imgQuiz = quiz.image;
    const imgQuizDiv = document.querySelector(".topo-quiz img")
    imgQuizDiv.setAttribute("src",imgQuiz);
    const perguntas = quiz.questions;
    const perguntaDiv = document.querySelector(".conteudo-quiz")
    for(let i = 0; i< perguntas.length; i++){
        const respostas = perguntas[i].answers;
        respostas.sort(comparador);
        perguntaDiv.innerHTML += `
        <div class="container-pergunta">
            <div class="box-texto q${i}" style="background-color:${perguntas[i].color};">
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
        document.querySelector(".box-texto.q"+next).scrollIntoView();
    }, 2000)
    numRespostas=quizzSelecionado.questions[i].answers.length
    const naoSelect=document.querySelector(".imagem.q"+i+".a"+j+".naoSelecionada")
    if (naoSelect==null) {
        for (let y=0; y<numRespostas; y++) {
            if (y!=j) {
                document.querySelector(".imagem.q"+i+".a"+y).classList.add('naoSelecionada')
            } else if (y==j && quizzSelecionado.questions[i].answers[j].isCorrectAnswer==true) {
                acertos+=1;
            }
        }
    }

    for (let y=0; y<numRespostas; y++) {
        if (quizzSelecionado.questions[i].answers[y].isCorrectAnswer) {
            document.querySelector(".texto-opcao.q"+i+".a"+y).classList.add('respostaCerta')
        } else {
            document.querySelector(".texto-opcao.q"+i+".a"+y).classList.add('respostaErrada')
        }
    }
    score=Math.round((acertos/quizzSelecionado.questions.length)*100)
    if (i==quizzSelecionado.questions.length-1) {
        resultado();
    }
    
}

function resultado () {
    let nivels=quizzSelecionado.levels;
    for (let i=0; i<nivels.length; i++) {
        if (nivels[i].minValue<=score) {
            document.querySelector(".resultado").innerHTML=`
        <div class="container-pergunta">
            <div class="box-texto" style="background-color: red;">
                <span>${nivels[i].title}</span>
            </div>
            <div class="box-opcoes">
                <div class="opcao">
                    <img src="${nivels[i].image}" />
                </div>
                <span class="texto-opcao">${nivels[i].text}</div>
            </div>
            <button class="reiniciar" onclick="reiniciarQuizz()">Reiniciar Quizz</button>
            <span class="voltarhome" onclick="voltarHome()">Voltar para home</span>    
        </div>`
        
        document.querySelector(".resultado").scrollIntoView();

        }
    }
}

function reiniciarQuizz () {
    acertos=0
    document.querySelector(".resultado").innerHTML=" "
    for (let i=0; i<quizzSelecionado.questions.length; i++){
        numRespostas=quizzSelecionado.questions[i].answers.length
        for (let y=0; y<numRespostas; y++) {
            document.querySelector(".texto-opcao.q"+i+".a"+y).classList.remove('respostaCerta');
            document.querySelector(".texto-opcao.q"+i+".a"+y).classList.remove('respostaErrada');
            document.querySelector(".imagem.q"+i+".a"+y).classList.remove('naoSelecionada');
        }
    }
    
    document.querySelector(".tela2").scrollIntoView(true);
}

function voltarHome () {
    acertos=0;
    quizzSelecionado=[];
    document.querySelector(".resultado").innerHTML=" "
    document.querySelector(".conteudo-quiz").innerHTML=" "
    document.querySelector(".tela1").classList.remove('escondido');
    document.querySelector(".tela2").classList.add('escondido');
    document.querySelector(".tela1").scrollIntoView(true);
}

function criarQuizz () {
    document.querySelector(".tela3").classList.remove('escondido');
    document.querySelector(".tela1").classList.add('escondido');
}

function verificarInformacoesBasicas() {
    tituloQuiz = document.querySelector(".container-inputs input:nth-child(1)").value
    imagemQuiz = document.querySelector(".container-inputs input:nth-child(2)").value
    qtdsPerguntasQuiz = Number(document.querySelector(".container-inputs input:nth-child(3)").value)
    qtdsNiveisQuiz = Number(document.querySelector(".container-inputs input:nth-child(4)").value)
    console.log(validarInfosBasicas())
    if(validarInfosBasicas()){
        document.querySelector(".comeco").classList.add("escondido")
        document.querySelector(".criar-perguntas").classList.remove("escondido")
        gerarCriacaoPerguntas();
    }else{
        alert("Preencha os dados corretamente");
    }
}
function gerarCriacaoPerguntas(){
    let criarPerguntasDiv = document.querySelector(".container-perguntas");
    console.log(qtdsPerguntasQuiz)
    for(let i = 1; i <= qtdsPerguntasQuiz; i++){
        criarPerguntasDiv.innerHTML += `
        <div class="container-inputs" onclick ="abrirEditarPergunta(this)">
            <div class="topo-container-inputs" ">
               <span>Pergunta ${i}</span><img src="/src/icon-edit.png">
           </div>
            <div class="box-inputs escondido">
                <div class="inputs">
                    <input id="pergunta${i}Titulo" type="text" placeholder="Texto da pergunta">
                    <input id="pergunta${i}Cor" type="text" placeholder="Cor de fundo da da pergunta">
                    <span>Resposta correta</span>
                    <input id="pergunta${i}RespostaCertaTexto" type="text" placeholder="Resposta correta">
                    <input id="pergunta${i}RespostaCertaImagem" type="text" placeholder="URL da imagem">
                    <span>Respostas incorretas</span>
                    <input type="text" placeholder="Resposta incorreta 1">
                    <input type="text" placeholder="URL da imagem 1">
                    <div class="espaco"></div>
                    <input type="text" placeholder="Resposta incorreta 2">
                    <input type="text" placeholder="URL da imagem 2">
                    <div class="espaco"></div>
                    <input type="text" placeholder="Resposta incorreta 3">
                    <input type="text" placeholder="URL da imagem 3">
                </div>
            </div>
        </div>
        `
    }
    const primeiroCriarPergunta = document.querySelector(".box-inputs");
    const primeiroIconEditPergunta = document.querySelector(".topo-container-inputs img")
    primeiroCriarPergunta.classList.remove("escondido");
    primeiroCriarPergunta.classList.add("aberto");
    primeiroIconEditPergunta.classList.add("escondido");
}
function abrirEditarPergunta(elemento){
    console.log(document.querySelector(".aberto") != null)
    if(document.querySelector(".aberto") != null){
        document.querySelector(".aberto").classList.add("escondido");
        document.querySelector(".aberto").classList.remove("aberto");
        document.querySelector(".escondio img").classList.remove("escondido")
    }
}

function validarInfosBasicas(){
    if(tituloQuiz.length > 19 && tituloQuiz.length < 66 && validURL(imagemQuiz) && qtdsPerguntasQuiz >= 3 && qtdsNiveisQuiz >= 2){
        return true;
    }
    return false;
}
function validURL(str) {
    let pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  }
