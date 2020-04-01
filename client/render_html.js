const log = require('../log.js')

const styles = {
	base: `<link rel='stylesheet' href='/client/css/base.css'/>`,
	auth: `<link rel='stylesheet' href='/client/css/auth.css'/>`,
	game: `<link rel='stylesheet' href='/client/css/game.css'/>`,
	mobile: `<link rel='stylesheet' href='/client/css/mobile.css'/>`,
	fourohfour: `<link rel='stylesheet' href='/client/css/404.css'/>`
}

const scripts = {
	game: `<script type='module' src='/client/js/init.js?v=3'></script>`,
	fourohfour: '',
	register: `<script type='module' src='/client/register.js?v=3'></script>`,
	login: `<script type='module' src='/client/js/login.js?v=3'></script>`,
	base: `<script type='module' src='/client/js/base.js?v=3'></script>`,
}





function header( css, desc ){

	return `
		<html>
			<head>
				<title>VoidRangers</title>

				<meta charset="utf-8">
			    <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1,user-scalable=no">

			    <meta name="Description" content=" ${ desc || 'javascript in space' }">
			    <meta property="og:url" content="https://voidrangers.online">
			    <meta property="og:title" content="VoidRangers">
			    <meta property="og:description" content="VoidRangers"> 
			    <meta property="og:image" content="https://voidrangers.online/resource/media/voidrangers.png"/>

			    <link rel='icon' href='/resource/media/favicon.ico'/>
				<!--<link href="data:image/x-icon;base64" rel="icon" type="image/x-icon" />-->
				${ styles.base + css }

			</head>`
}

function footer( script_includes ){
	return `${ script_includes || '' }
		</body>
	</html>`
}





const auth_overlays = ``

const game_overlays = ``


const auth_header = `

<div id='account-warning'>accounts inactive</div>

<div id='auth-header'>
	<div id='menu-toggle'>☰</div>
	<div id='auth-links'>
		<div class='auth-link'>
			<a href='/login'>login</a>
		</div>
		<div class='auth-link'>
			<a href='/register'>register</a>
		</div>
		<div class='auth-link'>
			<a href='/play'>play</a>
		</div>
	</div>
</div>`





function render_html( type, request ){

	
	
	let css_includes = ''
	let script_includes = ''
	let desc = false

	switch( type ){



	case 'index':

		css_includes += styles.base
		css_includes += styles.mobile
		css_includes += styles.auth

		script_includes += scripts.base

		return header( css_includes, desc ) + `

				<body>

					${ auth_overlays }

					${ auth_header }
	
			` + footer( script_includes )





	case 'login':

		css_includes += styles.base
		css_includes += styles.mobile
		css_includes += styles.auth

		script_includes += scripts.login

		return header( css_includes, desc ) + `

				<body>

					${ auth_overlays }

					${ auth_header }

					<form action='/login-attempt' method='POST'>
					<input type='email' name='email' placeholder='email'>
					<input type='password' name='password' placeholder='password'>
					<input type='submit'>
					</form>
	
			` + footer( script_includes )





	case 'register':

		css_includes += styles.base
		css_includes += styles.mobile
		css_includes += styles.auth

		script_includes += scripts.register

		return header( css_includes, desc ) + `

				<body>

					${ auth_overlays }

					${ auth_header }

					<form action='/register-attempt' method='POST'>
					<input type='email' name='email' placeholder='email'>
					<input type='password' name='password' placeholder='password'>
					<input type='password' placeholder='password again'>
					<input type='submit'>
					</form>
	
			` + footer( script_includes )





	case 'play':

		css_includes += styles.base
		css_includes += styles.mobile
		css_includes += styles.game

		script_includes += scripts.game

		return header( css_includes, desc ) + `

		<div id='chat'>
			<div id='chat-content'>
			</div>
			<input id='chat-input' type='text' placeholder="say:">
		</div>` + footer( script_includes )




	case '404':

		css_includes += styles.fourohfour

		desc = 'VoidRangers 404: missing page'

		return 

		header( css_includes, desc ) + `
		<body>
			${ auth_overlays }
			<div id='header'>
				VoidRangers
			</div>
			<div id='content'>
				<h4 class='display'>404</h4>
				<div class='fourohfour'>
					nothing to see here - check your URL<br>
					<a href='/'>click here</a> to return to base
				</div>
			</div>
		` + 
		footer( script_includes )

	default: break



	}



}



module.exports = render_html

