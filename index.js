
// NATIVE PACKAGES
const host = require('os').hostname()
const express = require('express')
const http = require('http')

const env = require('./.env.js')
// const env = require(!fs.existsSync("env.js") ? './default_env.js' : './.env.js')

// NPM 
const bodyParser = require('body-parser')
const session = require('express-session')
const cookie = require('cookie')
const cookieParser = require('cookie-parser')
// const multer = require('multer')
const FormData = require('express-form-data');
const mkdirp = require('mkdirp')
const fs = require('fs')
const os = require('os')


const MemoryStore = require('memorystore')(session)

const uuid = require('uuid').v4


const exp = new express()

const server = http.createServer( exp )

const FormData_options = {
  uploadDir: os.tmpdir(),
  autoClean: true
}
 
// parse data with connect-multiparty. 
exp.use( FormData.parse( FormData_options ) )
// delete from the request all empty files (size == 0)
exp.use( FormData.format() )
// change the file objects to fs.ReadStream 
// exp.use( FormData.stream() )
// union the body and the files
// exp.use( FormData.union() )






// HTTP ROUTER
// exp.set( 'port', env.PORT )

exp.use('/client', express.static( __dirname + '/client' )) // __dirname + 
// exp.use('/static', express.static( '../resource' )) // __dirname + 
// exp.use('/resource', express.static( '../resource' )) // __dirname + 
// exp.use('/favicon.ico', express.static( '/static/media/favicon.ico') )
// exp.use('/fs', express.static(__dirname + '/fs'))
exp.use( bodyParser.json({ 
	type: 'application/json' 
}))

// routing
exp.get('/', function(request, response) {
	response.status( 404 ).sendFile('client/html/index.html', { root: __dirname })
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

	console.log('yehoo')

})


















