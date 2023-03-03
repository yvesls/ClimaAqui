const express = require('express');
// documentação do https-node: https://nodejs.org/api/https.html
// responsável por permitir chamadas a apis externas
const https = require("https");
const bodyParser = require("body-parser");
const path = require('path');
require('dotenv').config();
const appid = process.env.APPID_OPENWEATHERMAP;
const app = express();
const port = process.env.PORT;

let jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(express.static(path.join(__dirname, 'public')));
app.use(urlencodedParser); // para trabalhar diretamente com formulários (forms nos arquivos html)
app.use(jsonParser); // para o async await no script.js (formato json)
 
app.listen(port, () => {
    console.log(`Example app listening on port ${port}.`);
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post("/", (req, res) => {
    const cidade = req.body.nomeCidade;
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+cidade+"&appid="+appid+"&units=metric&lang=pt";
    https.get(url, (response)=>{
        if(response.statusCode >= 200 && response.statusCode < 300){
            response.on("data", (data) => {
                weatherData = JSON.parse(data);
                temperatura = weatherData.main.temp;
                descricao = weatherData.weather[0].description
                icone = weatherData.weather[0].icon;
                imagemIcone = `https://openweathermap.org/img/wn/${icone}@2x.png`;
                res.json({ mensagem: 'Dados recebidos com sucesso!', cidade, temperatura, descricao, imagemIcone });
            })
        }else if(response.statusCode >= 400 ) {
            res.json({ mensagem: 'Erro ao receber os dados.', erro: response.statusCode});
        }
    });
});
