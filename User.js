

module.exports = class User {

	constructor( init ){
		
		init = init || {}

		this.name = 'person' + Math.random() * 1000

	}

}