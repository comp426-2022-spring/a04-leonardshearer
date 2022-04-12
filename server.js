import * as coin from './modules/coin.mjs'
import express from 'express'
import minimist from 'minimist'

const app = express()
const args = minimist(process.argv.slice(2))

console.log(args)

const help = (`
server.js [options]

--port	Set the port number for the server to listen on. Must be an integer
            between 1 and 65535.

--debug	If set to true, creates endlpoints /app/log/access/ which returns
            a JSON access log from the database and /app/error which throws 
            an error with the message "Error test successful." Defaults to 
            false.

--log		If set to false, no log files are written. Defaults to true.
            Logs are always written to database.

--help	Return this message and exit.
`)

if (args.help || args.h) {
    console.log(help)
    process.exit(0)
}

const HTTP_PORT = (1 <= args.port && args.port <= 65535) ? args.port : 5555
const server = app.listen(HTTP_PORT, () => {
    console.log('App listening on port %PORT%'.replace('%PORT%', HTTP_PORT))
});

app.get('/app', (req, res) => {
    res.type('text/plain')
    res.status(200).end('OK')
});

app.get('/app/flip', (req, res) => {
    res.type('application/json')
    res.status(200).json({ 'flip': coin.coinFlip() })
});

app.get('/app/flips/:number', (req, res) => {
    const raw = coin.coinFlips(parseInt(req.params.number))
    const summary = coin.countFlips(raw)
    res.type('application/json')
    res.status(200).json({ 'raw': raw, 'summary': summary })
});

app.get('/app/flip/call/heads', (req, res) => {
    res.type('application/json')
    res.status(200).json(coin.flipACoin('heads'))
});

app.get('/app/flip/call/tails', (req, res) => {
    res.type('application/json')
    res.status(200).json(coin.flipACoin('tails'))
});

app.use(function (req, res) {
    res.type('text/plain')
    res.status(200).status(404).end('404 NOT FOUND')
});

