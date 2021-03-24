const { useEffect, useState } = React;

function App() {
	const [ active, setActive ] = useState( false );

	useEffect( () => {
		const listener = () => {
			if ( ! active ) {
				return;
			}

			console.log( 11 );
		};

		const activeListener = () => {
			setActive( ( ( prevState ) => ! prevState ) );
		};

		document.addEventListener( 'click', listener );
		document.querySelector( '#wp-admin-bar-elementor_comments > a' ).addEventListener( 'click', activeListener );

		return () => {
			document.removeEventListener( 'click', listener );
			document.removeEventListener( 'click', activeListener );
		};
	}, [ active ] );

	return (
		<div> asd </div>
	);
}

const element = document.createElement( 'div' );
element.setAttribute( 'id', 'e-comments' );

document.body.appendChild( element );

ReactDOM.render(
	<App />,
	document.getElementById( 'e-comments' )
);

