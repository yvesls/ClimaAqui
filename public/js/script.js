const form = document.getElementById('meu-form');
const mensagem = document.getElementById('mensagem');

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    mensagem.innerHTML = "<div class='spinner-grow text-dark m-auto' role='status'><span class='visually-hidden'>Carregando...</span></div>";
    const cidadeInput = form.elements.nomeCidade;
    if (cidadeInput.value.trim() === "") {
        console.log("Campo cidade vazio");
        return;
    }
    console.log(form.elements.nomeCidade.value);
    const formData = {nomeCidade: form.elements.nomeCidade.value};
    console.log(formData);
    try {
      const response = await fetch("/", {
        method: "POST",
        headers: {
            'Content-type': 'application/json; charset=utf-8', //x-www-form-urlencoded
        },
        body: JSON.stringify(formData),
      })
      const json = await response.json();
      configuraExibicao(json);
    } catch (error) {
      console.log(error);
    }finally {
        mensagem.innerHTML = ''
    }
  });
  
function configuraExibicao(json) {
  const resultado = document.getElementById("resultado");
  const titulo = document.getElementById("resultado-titulo");
  const descricao = document.getElementById("resultado-descricao");
  const imagem = document.getElementById("resultado-img");
  resultado.style.display = 'block';
  titulo.innerHTML = '';
  descricao.innerHTML = '';
  imagem.innerHTML = '';
  if(json.descricao === undefined){
    titulo.innerHTML = `Erro ${json.erro}. Cidade não encontrada.`;
  }else {
    titulo.innerHTML = `${json.cidade} ${json.temperatura} ºC`;
    descricao.innerHTML = json.descricao;
    imagem.innerHTML = `<img src='${json.imagemIcone}'></img>`;
  }
  
}