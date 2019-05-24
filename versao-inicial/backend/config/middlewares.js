//MIDDLEWARES.JS
const bodyParser = require('body-parser')
const cors = require('cors')

module.exports = app => {
    app.use(bodyParser.json())
    app.use(cors()) //para dar acesso do backend para o frontend atraves de rotas
}