
let game = false

module.exports = function( init ){

	if( game ) return game

	game = new Game( init )

	return game

}










class Game {

	constructor( init ){

		init = init || {}

		this.name = 'The Whole Shebang'

	}

}


