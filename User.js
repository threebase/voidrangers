

module.exports = class User {

	constructor( init ){
		
		init = init || {}

		this.vrid = init.vrid

		this.name = 'person' + Math.random() * 1000

	}

}