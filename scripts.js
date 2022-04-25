quizzes=[]
quizzSelecionado=[]
acessarApi();
let acertos=0;
let score=0;
let tituloQuiz;
let qtdsPerguntasQuizz;
let qtdsNiveisQuizz;
let listaSeusQuizzes=[];
let quizzCriado = {}
let quizzDoUsuario;
const arrayIds = JSON.parse(localStorage.getItem("idQuizzCriado"));
function acessarApi () {
    const promise=axios.get('https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes');
    promise.then(carregarDados); 

}

function carregarDados (response) {
    quizzes=response.data;
    adcQuizzes ();
}

 

function adcQuizzes () {
    for (let i=0; i<quizzes.length; i++) {
        if (arrayIds.includes(quizzes[i].id)) {
            document.querySelector(".seusquizzes").classList.remove('escondido')
            document.querySelector(".quizzbox").classList.add('escondido')
            document.querySelector(".quizzes").innerHTML+=`<div>
            <img src="${quizzes[i].image}">
            <h3 onclick="selecionarQuizz(${i})">${quizzes[i].title}</h3>
            </div>`
        }
        document.querySelector(".quizzes.geral").innerHTML+=`<div>
        <img src="${quizzes[i].image}">
        <h3 onclick="selecionarQuizz(${i})">${quizzes[i].title}</h3>
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
            <div class="box-resultado">
                <div class="opcao">
                    <img src="${nivels[i].image}"/>
                </div>
                <span class="texto-opcao">${nivels[i].text}</span></div>
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
    document.querySelector(".tela3").classList.add('escondido');
    document.querySelector(".tela1").scrollIntoView(true);
}

function criarQuizz () {
    document.querySelector(".tela3").classList.remove('escondido');
    document.querySelector(".tela1").classList.add('escondido');
}

function verificarInformacoesBasicas() {
    tituloQuiz = document.querySelector(".container-inputs input:nth-child(1)").value
    imagemQuiz = document.querySelector(".container-inputs input:nth-child(2)").value
    qtdsPerguntasQuizz = Number(document.querySelector(".container-inputs input:nth-child(3)").value)
    qtdsNiveisQuizz = Number(document.querySelector(".container-inputs input:nth-child(4)").value)

    if(validarInfosBasicas()){
        document.querySelector(".comeco").classList.add("escondido")
        document.querySelector(".criar-perguntas").classList.remove("escondido")
        gerarCriacaoPerguntas();
        quizzCriado = {
            title: tituloQuiz,
            image: imagemQuiz,
            questions: [],
            levels: []
        }
    }else{
        quizzCriado = {};
        return alert("Preencha os dados corretamente!");
    }
}
function gerarCriacaoPerguntas(){
    let criarPerguntasDiv = document.querySelector(".container-perguntas");
    for(let i = 1; i <= qtdsPerguntasQuizz; i++){
        criarPerguntasDiv.innerHTML += `
        <div class="container-inputs">
            <div class="topo-container-inputs" onclick ="abrirEditarPergunta(this)">
               <span>Pergunta ${i}</span><img src="src/icon-edit.png">
           </div>
            <div class="box-inputs escondido">
                <div class="inputs">
                    <input id="pergunta${i}Titulo" type="text" placeholder="Texto da pergunta">
                    <input id="pergunta${i}Cor" type="text" placeholder="Cor de fundo da da pergunta">
                    <span>Resposta correta</span>
                    <input id="pergunta${i}RespostaCertaTexto" type="text" placeholder="Resposta correta">
                    <input id="pergunta${i}RespostaCertaImagem" type="text" placeholder="URL da imagem">
                    <span>Respostas incorretas</span>
                    <input class="pergunta${i}RespostaTexto" type="text" placeholder="Resposta incorreta 1">
                    <input class="pergunta${i}RespostaImagem" type="text" placeholder="URL da imagem 1">
                    <div class="espaco"></div>
                    <input class="pergunta${i}RespostaTexto" type="text" placeholder="Resposta incorreta 2">
                    <input class="pergunta${i}RespostaImagem" type="text" placeholder="URL da imagem 2">
                    <div class="espaco"></div>
                    <input class="pergunta${i}RespostaTexto" type="text" placeholder="Resposta incorreta 3">
                    <input class="pergunta${i}RespostaImagem" type="text" placeholder="URL da imagem 3">
                </div>
            </div>
        </div>
        `
    }
    const primeiraPergunta = document.querySelector(".box-inputs");
    primeiraPergunta.classList.remove("escondido");
    const primeiroIConEdit = document.querySelector(".topo-container-inputs img");
    primeiroIConEdit.classList.add("escondido");
}
function abrirEditarPergunta(elemento){
    const criarPerguntaDiv = elemento.parentNode.querySelector(".box-inputs")
    const iconEdit = elemento.querySelector("img")
    criarPerguntaDiv.classList.toggle("escondido")
    iconEdit.classList.toggle("escondido")
}
function verificarCriarPerguntas(){
    for(let i = 1; i <= qtdsPerguntasQuizz; i++){
        let perguntaTitulo = document.getElementById(`pergunta${i}Titulo`).value
        let perguntaCor = document.getElementById(`pergunta${i}Cor`).value
        let respostaCertaTexto = document.getElementById(`pergunta${i}RespostaCertaTexto`).value
        let respostaCertaImagem = document.getElementById(`pergunta${i}RespostaCertaImagem`).value
        let respostaTexto = document.querySelector(`.pergunta${i}RespostaTexto`).value
        let respostaImagem = document.querySelector(`.pergunta${i}RespostaImagem`).value
        if(perguntaTitulo.length > 20 && validColorHex(perguntaCor) && validURL(respostaCertaImagem) && respostaCertaTexto != "" && validURL(respostaImagem) && respostaTexto != ""){
            quizzCriado.questions.push({
                title: perguntaTitulo,
                color: perguntaCor,
                answers: [{
                    text: respostaCertaTexto,
                    image: respostaCertaImagem,
                    isCorrectAnswer: true
                }]
            })
            
            const respostasTextoDiv = document.querySelectorAll(`.pergunta${i}RespostaTexto`)
            const respostasImagemDiv = document.querySelectorAll(`.pergunta${i}RespostaImagem`)
            for(let j = 0; j < respostasTextoDiv.length; j++){
                let resposta = respostasTextoDiv[j];
                let imagem = respostasImagemDiv[j];
                if(Boolean(resposta.value) && validURL(imagem.value)){
                    quizzCriado.questions[i-1].answers.push({
                        text: resposta.value,
                        image: imagem.value,
                        isCorrectAnswer: false
                    })
                }else if(!Boolean(resposta.value) && validURL(imagem.value) || Boolean(resposta.value) && !validURL(imagem.value)){
                    quizzCriado.questions = [];
                    return alert("Preencha os dados corretamente!");
                }  
            }
            
       }else{
            quizzCriado.questions = [];
            return alert("Preencha os dados corretamente!");
       }
    }
    gerarCriadorNiveis();   
}
function gerarCriadorNiveis() {
    document.querySelector(".criar-niveis").classList.remove("escondido")
    document.querySelector(".criar-perguntas").classList.add("escondido")
    let criarNiveisDiv = document.querySelector(".container-niveis")
    for(let i = 1; i <= qtdsNiveisQuizz; i++){
        criarNiveisDiv.innerHTML += `
        <div class="container-inputs">
            <div class="topo-container-inputs" onclick ="abrirEditarPergunta(this)">
               <span>Nível ${i}</span><img src="src/icon-edit.png">
           </div>
            <div class="box-inputs escondido">
                <div class="inputs">
                    <input id="nivel${i}Titulo" type="text" placeholder="Título do nível">
                    <input id="nivel${i}%Minima" type="text" placeholder="% de acerto mínima">
                    <input id="nivel${i}Imagem" type="text" placeholder="URL da imagem do nível">
                    <input id="nivel${i}Descricao" type="text" placeholder="Descrição do nível">
                </div>
            </div>
        </div>
        `
    }
    const primeiroNivel = document.querySelector(".container-niveis .box-inputs");
    primeiroNivel.classList.remove("escondido");
    const primeiroIConEdit = document.querySelector(".container-niveis .topo-container-inputs img");
    primeiroIConEdit.classList.add("escondido");
}
function verificarCriarNiveis() {
    let validPorcentagemMin = false;
    for(let i = 1; i <= qtdsNiveisQuizz; i++){
        let tituloNivel = document.getElementById(`nivel${i}Titulo`).value;
        let porcentagemMinima = Number(document.getElementById(`nivel${i}%Minima`).value);
        let imagemNivel = document.getElementById(`nivel${i}Imagem`).value;
        let descricaoNivel = document.getElementById(`nivel${i}Descricao`).value;
        
        if(tituloNivel.length > 10 && porcentagemMinima >= 0 && porcentagemMinima <= 100 && descricaoNivel.length > 30 && validURL(imagemNivel)){
            quizzCriado.levels.push({
                title: tituloNivel,
                image: imagemNivel,
                text: descricaoNivel,
                minValue: porcentagemMinima
            })
            if(porcentagemMinima === 0){
                validPorcentagemMin = true;
            }
        }else{
            quizzCriado.levels = [];
            return alert("Preencha os dados corretamente!");
        }
    }
    if(validPorcentagemMin === false){
        quizzCriado.levels = [];
        return alert("Preencha os dados corretamente!");
    }
    const request = axios.post('https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes', quizzCriado);
    request.then(finalizarCriarQuizz);
    request.catch(erro => console.log(erro))      
}
function finalizarCriarQuizz(){
    const telaSucesso = document.querySelector(".sucesso-quiz");
    const telaCriarNiveis = document.querySelector(".criar-niveis");
    telaSucesso.classList.remove("escondido");
    telaCriarNiveis.classList.add("escondido");

    document.querySelector(".sucesso-quiz .conteudo").innerHTML = `
        <span>Seu quizz está pronto!</span>
        <div class="quizz-criado">
            <img src="${quizzCriado.image}" alt="">
            <h4>${quizzCriado.title}</h4>
        </div>
        <div class="botoes">
            <button class="reiniciar" onclick="acessarQuizzCriado()">Acessar Quizz</button>
            <span class="voltarhome" onclick="voltarHome()">Voltar para home</span>
        </div>
    `
}
function acessarQuizzCriado(){
    document.querySelector(".tela3").classList.add("escondido")
    document.querySelector(".tela2").classList.remove("escondido")
    comecarQuiz(quizzCriado);
}
function validarInfosBasicas(){
    if(tituloQuiz.length > 19 && tituloQuiz.length < 66 && validURL(imagemQuiz) && qtdsPerguntasQuizz >= 3 && qtdsNiveisQuizz >= 2){
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
function validColorHex(str){
    let teste = /^#[0-9A-F]{6}$/i
    return teste.test(str);
}
