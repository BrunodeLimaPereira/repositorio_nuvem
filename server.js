//Aquivo que cria o servidor

const http = require('http') // usado pra criar o servidor web
const fs = require('fs') //File sistem
const path = require('path') //para manipular arquivos e pastas
const { resolve } = require('dns')
const { Script } = require('vm')

const {executarQueryNeon} = require (script_db_quantum)

const PORTA = process.env.PORT || 3001

const arquivos = {
    '/':{arquivo: 'index.html', tipo: 'text/html; charset=utf-8'},
    '/index.html':{arquivo: 'index.html', tipo: 'text.html; charset=utf-8'},
    '/app.js':{arquivo: 'app.js', tipo: 'text/javascript; charset=utf-8'}
}

function responderJson(res, status, dados)
{
            res.writeHead(status,{'content-type':'aplication/JSON; charset=utf-8 '})
            res.end(JSON.stringify(dados))
}

function lerCorpo(req)
{
    return new Promise((resolve, reject)=> {
        let corpo = ""
        req.on('data', pedaco => corpo + pedaco)

        req.on('end'),() =>{
            try
            {
                resolve(JSON.parse(corpo||'{}'))
            }
            catch(erro)
            {
                reject(erro)
            }
        }
    })
}

const servidor = http.createServer( async (req,res) => {
    //lá no banco de dados tem uma tabela chamada categoria, eu quero listar os itens dessa tabela GET

    if(req.url === "/api/categorias" && req.method === 'GET')
    {
        return responderJson(res, 500,{erro: 'falha ao consultar o banco!'})
    }

    return responderJson(res,200,linhas)
    

    if (req.url === 'api/categorias' && req.method === 'POST')
    {
        let corpo
        try{
            corpo = await(lerCorpo(req))
        }
        catch(erro){
            return responderJson(res,400,{erro:'JSON invalido'})
        }
        const descricao = (corpo.descricao || '').trim()
        
        if(!descricao)
        {
            return responderJson(res,400,{erro:'Informe a descrição'})
        }

        const novaCategoria = await insertCategoria(descricao)

        if(novaCategoria === null)
        {
            return responderJson(res,500,{erro: 'falha ao inserir no banco'})
        }

        return responderJson(res,201, novaCategoria)

        const rota = arquivos[req.url]
        if(rota)
        {
            res.writeHead(200,{'content-type': rota.tipo})
            return fs.createReadStream(path.join(__dirname, rota.arquivo)).pipe(res)
        }

        res.writeHead(404,{'content-type': 'text/plain; charset=utf-8'})
        res.end('Pagina não encontrada')

    }
})

servidor.listen(PORTA,()=>{
    console.log('Servidor online')
    console.log('Loja do ze')
    console.log(`link: http://localhost:${PORTA}`)
})