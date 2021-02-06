const express = require('express')
const fetch = require('node-fetch')
const bodyParser = require('body-parser')
// require('dotenv').config()

const symbols = ['TSLA', 'AAPL', 'ADS']
const instruments = []

const app = express()
app.use(bodyParser.urlencoded({extended:false}))
app.set('view engine', 'pug')

// app.use(express.static(__dirname+"\scripts"))


app.get('/', async (req, res)=>{
    res.render('index', {title:"My big boy investments", instruments})
})

app.post('/', async (req, res)=>{
    const symbol = req.body.symbol
    symbols.push(symbol)
    fetchSymbolData(symbol, res)
    res.redirect('/')
})

app.get("/delete/:symbol", (req, res)=>{
    console.log(req.params.symbol)
    let index = symbols.findIndex(e=>e==req.params.symbol)

    if(index<0){
        res.status(400).json({message:"Bad request"})
    }
    symbols.splice(index,1)
    instruments.splice(index, 1)
    console.log("UPDATED SYMBOL: ", symbols)
    res.redirect('/')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, async ()=>{
    console.log(`Listening on port ${PORT}`)
    for(symbol of symbols){
        fetchSymbolData(symbol)
    }
})

async function fetchSymbolData(symbol, res){
    try{
        const response = await fetch(`https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-profile?symbol=${symbol}`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": process.env.KEY,
                "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com"
            }
        })
        const responseJSON = await response.json()
        instruments.push(responseJSON)
    }catch (err){
        res.json(err)
    }
}