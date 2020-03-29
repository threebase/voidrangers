
// NATIVE PACKAGES
const http = require('http')
const fs = require('fs')
const os = require('os')
const host = os.hostname()

// CUSTOM PACKAGES
const log = require('./log.js')
const env = require('./.env.js')
// const env = require(!fs.existsSync("env.js") ? './default_env.js' : './.env.js')

// NPM 
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const cookie = require('cookie')
const cookieParser = require('cookie-parser')
const FormData = require('express-form-data');
const mkdirp = require('mkdirp')
const MemoryStore = require('memorystore')(session)
const uuid = require('uuid').v4


// APPLICATION LOGIC
const WSS = require('./Server.js')()
const User = require('./User.js')
const Game = require('./GAME.js')({})



// INITIALIZATION
const exp = new express()

const server = http.createServer( exp )

const FormData_options = {
	uploadDir: os.tmpdir(),
	autoClean: true
}


const STORE = new MemoryStore({
	checkPeriod: 1000 * 60 * 60 * 24 * 2// prune expired entries every 24h
})


// CACHED SESSIONS
const lru_session = session({
	cookie: { maxAge: 1000 * 60 * 60 * 24 * 2 },
	resave: false,
	saveUninitialized: true,
	store: STORE,
	secret: env.SECRET
})

 
// parse data with connect-multiparty. 
exp.use( FormData.parse( FormData_options ) )
// delete from the request all empty files (size == 0)
exp.use( FormData.format() )
// change the file objects to fs.ReadStream 
// exp.use( FormData.stream() )
// union the body and the files
// exp.use( FormData.union() )



const gatekeep = function(req, res, next) {
	log('gatekeep', req.path )
	if( req.path.match(/\/resource/) || req.path.match(/\/ws/) ){
		next()
	}else{
		req.session.USER = new User( req.session.USER )
		next()
	}
}



// HTTP ROUTER
// exp.set( 'port', env.PORT )

exp.use('/client', express.static( __dirname + '/client' )) // __dirname + 
// exp.use('/static', express.static( '../resource' )) // __dirname + 
exp.use('/resource', express.static( __dirname + '/resource' )) // __dirname + 
// exp.use('/favicon.ico', express.static( '/static/media/favicon.ico') )
// exp.use('/fs', express.static(__dirname + '/fs'))
exp.use( bodyParser.json({ 
	type: 'application/json' 
}))

exp.use( lru_session )

exp.use( gatekeep )


// routing
exp.get('/', function(request, response) {
	if( request.session.USER.uuid ){
		response.status( 200 ).send('<html><style>body{background: black; color: green; font-size: 2rem;}</style><body>authenticated login</body></html>')
	}else{
		response.status( 200 ).sendFile('client/html/index.html', { root: __dirname })
	}
})


exp.post('*', function(request, response){
	log('routing', 'POST 404: ' + request.url)
	if( request.url.match(/\.html$/) ){
		response.status( 404 ).sendFile('/client/html/404.html', { 
			root : '../' 
		})    
	}else{
		response.end()
	}
})

exp.get('*', function(request, response){
	// response.status( 404 ).send( render('404', request) )
	response.status(404).sendFile('/client/html/404.html', { root : __dirname })    
})









server.listen( env.PORT, function() {

	log( 'boot', 'Starting server on ' + host + ':' + env.PORT, Date.now() )

	WSS.on('connection', function connection( socket, req ) {

		log('wss', 'socket connection ')

		// socket.upgradeReq = req // this works for perma-storage but is 20% heavier according to ws man

		const cookies = cookie.parse( req.headers.cookie )
		const sid = cookieParser.signedCookie( cookies['connect.sid'], env.SECRET )

		STORE.get( sid, function ( err, session ) {

			if( err ){

				const msg = 'error retrieving pilot records'

				socket.send(JSON.stringify({
					type: 'error',
					msg: msg
				}))

				log('flag', 'socket connection err: ', msg)
				
				return false

			}else {

				if( !session ) {

					log('flag', 'no socket session found')

				}else{

					STORE.createSession( req, session ) //creates the session object and APPEND on req (!)

					socket.request = req

					if( Object.keys( SOCKETS ).length >= env.MAX_CONNECTIONS ) {
						let msg = 'The Universe is full, try again later sorry.'
						return {
							success: false,
							msg: msg
						}
					}

					socket.request.session.USER = new User( socket.request.session.USER )

					socket.uuid = socket.request.session.USER.uuid

					SOCKETS[ socket.uuid ] = socket

					log('flag', '**** BIND WS EVENTS HERE *******')

					SOCKETS[ socket.uuid ].send( JSON.stringify( {
						type: 'session_init',
						patron: SOCKETS[ socket.uuid ].request.session.USER.publish(),
						map: MAP
					}) )

				}

			}

		})

	})

})


















