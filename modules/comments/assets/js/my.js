const { useEffect, useState } = React;

let isActive = false;

function Comment( props ) {
	const [ input, setInput ] = useState( '' );
	const [ children, setChildren ] = useState( [] );

	useEffect( () => {
		setChildren( props.comments.filter( ( current ) => current.parent === props.id ) );
	}, [] );

	const submit = ( e ) => {
		e.preventDefault();

		fetch( elementorCommon.config.urls.rest + 'wp/v2/comments', {
			method: 'POST',
			body: JSON.stringify( {
				parent: props.id,
				content: input,
				element_id: props.element_id,
				post: elementorCommon.config.post_id,
			} ),
			headers: { 'X-WP-Nonce': wpApiSettings.nonce, 'Content-Type': 'application/json' },
		} ).then( ( response ) => response.json() )
			.then( ( data ) => setChildren( ( prev ) => [ ...prev, data ] ) );
	};

	const date = new Date( props.date );

	return (
		<div className="comment-modal" id={`comment-modal-${ props.id }`}>
			<div>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<img src={props.author_avatar_urls[ 48 ]} style={{ height: '30px', 	borderRadius: '300px' }}/>
					<span style={{ marginLeft: '10px' }}> {props.author_name} </span>
				</div>
				<div>
					{ date.toLocaleString() }
				</div>
				<div dangerouslySetInnerHTML={{ __html: props.content.rendered }} />

				{ children.map( ( item ) => {
					return (
						<div key={item.id}>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<img src={item.author_avatar_urls[ 48 ]} style={{ height: '30px', 	borderRadius: '300px' }}/>
								<span style={{ marginLeft: '10px' }}> {item.author_name} </span>
							</div>
							<div dangerouslySetInnerHTML={{ __html: item.content.rendered }} />
						</div>
					);
				} ) }

				<input style={{ width: '100%' }} value={input} onChange={( e ) => setInput( e.target.value )} />
				<button onClick={( e ) => submit( e )}>Submit</button>
			</div>
		</div>
	);
}

function NewComment( props ) {
	const [ input, setInput ] = useState( '' );
	const [ closed, setClosed ] = useState( false );
	const [ data, setData ] = useState( null );

	const submit = ( e ) => {
		e.preventDefault();

		fetch( elementorCommon.config.urls.rest + 'wp/v2/comments', {
			method: 'POST',
			body: JSON.stringify( {
				content: input,
				element_id: props.elementId,
				post: elementorCommon.config.post_id,
			} ),
			headers: { 'X-WP-Nonce': wpApiSettings.nonce, 'Content-Type': 'application/json' },
		} ).then( ( response ) => response.json() )
			.then( ( data ) => setData( data ) );
	};

	const close = ( e ) => {
		e.preventDefault();

		setClosed( true );
	};

	if ( closed ) {
		return '';
	}

	return (
		! data ? ( <div className="comment-modal">
			<div>
				<input placeholder="Add a comment. Use @ to mention" className="comment-modal-input" style={{ width: '100%' }} value={input} onChange={( e ) => setInput( e.target.value )} />
				<button className="comment-modal-submit" onClick={( e ) => submit( e )}>Submit</button>
				<span id="comment-open"/>
				<button className="comment-modal-cancel" onClick={( e ) => close( e )}>Cancel</button>
			</div>
		</div> ) : <Comment { ...data } comments={[]} />
	);
}

// function App() {
// 	const [ comments, setComments ] = useState( [] );
//
// 	useEffect( () => {
//
// 	} );
//
// 	useEffect( () => {
// 		const listener = ( el ) => {
// 			if ( ! isActive ) {
// 				return;
// 			}
//
// 			const element = el.srcElement.closest( '.elementor-section, .elementor-column, .elementor-widget' );
//
// 			const icon = document.createElement( 'div' );
// 			icon.classList.add( 'comment-icon' );
//
// 			element.appendChild( icon );
// 		};
//
// 		document.addEventListener( 'click', listener );
//
// 		return () => {
// 			document.removeEventListener( 'click', listener );
// 		};
// 	} );
//
// 	return <div/>;
// 	// return ( comments.map( ( comment ) => (
// 	// 	<Comment key={comment.id} {...comment} />
// 	// ) ) );
// }

jQuery( () => {
	const element = document.createElement( 'div' );
	element.setAttribute( 'id', 'e-comments' );

	document.body.appendChild( element );

	elementorCommon.elements.$window.on( 'elementor/frontend/modal/init', () => {
		document.querySelector( '#e-comments__add-comment' ).addEventListener( 'click', () => {
			isActive = ! isActive;
		} );
	} );

	fetch( elementorCommon.config.urls.rest + 'wp/v2/comments?post=' + elementorCommon.config.post_id )
		.then( ( response ) => response.json() )
		.then( ( data ) => {
			data.forEach( ( comment ) => {
				const iconWrapper = document.createElement( 'div' );
				const icon = document.createElement( 'div' );

				icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="27" height="38" fill="none"><g filter="url(#filter0_f)"><ellipse cx="14" cy="33" fill="#000" fill-opacity=".12" rx="6" ry="3"/></g><mask id="a" width="25" height="33" x="1" y="1.375" fill="#000" maskUnits="userSpaceOnUse"><path fill="#fff" d="M1 1.375h25v33H1z"/><path fill-rule="evenodd" d="M19.905 23.825c2.787-2.161 4.595-5.645 4.595-9.575 0-6.558-5.037-11.875-11.25-11.875S2 7.692 2 14.25c0 3.93 1.808 7.414 4.595 9.575 2.124 1.69 5.12 4.358 5.794 8.658.067.43.426.763.861.763s.794-.333.861-.763c.673-4.3 3.67-6.968 5.794-8.658z" clip-rule="evenodd"/></mask><path fill="#4AB7F4" fill-rule="evenodd" d="M19.905 23.825c2.787-2.161 4.595-5.645 4.595-9.575 0-6.558-5.037-11.875-11.25-11.875S2 7.692 2 14.25c0 3.93 1.808 7.414 4.595 9.575 2.124 1.69 5.12 4.358 5.794 8.658.067.43.426.763.861.763s.794-.333.861-.763c.673-4.3 3.67-6.968 5.794-8.658z" clip-rule="evenodd"/><path fill="url(#paint0_linear)" d="M19.905 23.825l-.613-.79-.009.007.622.783zm-13.31 0l.622-.783-.01-.007-.612.79zm5.794 8.658l-.988.155.988-.155zm1.722 0l.988.155-.988-.155zm6.407-7.868c3.03-2.35 4.982-6.126 4.982-10.365h-2c0 3.62-1.665 6.813-4.207 8.785l1.225 1.58zM25.5 14.25c0-7.059-5.434-12.875-12.25-12.875v2c5.61 0 10.25 4.817 10.25 10.875h2zM13.25 1.375C6.434 1.375 1 7.191 1 14.25h2C3 8.192 7.64 3.375 13.25 3.375v-2zM1 14.25c0 4.24 1.952 8.015 4.982 10.365l1.226-1.58C4.665 21.062 3 17.87 3 14.25H1zm12.377 18.078c-.737-4.703-4.013-7.578-6.16-9.286l-1.245 1.566c2.102 1.671 4.819 4.133 5.429 8.03l1.976-.31zm-.127-.082c.046 0 .081.02.1.036a.08.08 0 01.027.046l-1.976.31c.137.873.88 1.608 1.849 1.608v-2zm-.127.082a.08.08 0 01.027-.046.154.154 0 01.1-.036v2c.97 0 1.712-.735 1.85-1.608l-1.977-.31zm6.16-9.286c-2.147 1.708-5.423 4.583-6.16 9.286l1.976.31c.61-3.897 3.327-6.359 5.429-8.03l-1.245-1.566z" mask="url(#a)"/><defs><linearGradient id="paint0_linear" x1="13.25" x2="13.25" y1="2.375" y2="33.246" gradientUnits="userSpaceOnUse"><stop stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity=".35"/></linearGradient><filter id="filter0_f" width="16" height="10" x="6" y="28" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur" stdDeviation="1"/></filter></defs></svg>';

				iconWrapper.classList.add( 'comment-icon-wrapper' );
				icon.classList.add( 'comment-icon' );

				iconWrapper.appendChild( icon );

				const innerElement = document.querySelector( `.elementor-element-${ comment.element_id }` );

				if ( ! innerElement ) {
					return;
				}

				let isOpen = false;

				icon.addEventListener( 'click', ( e ) => {
					if ( ! isOpen ) {
						const modal = document.createElement( 'div' );
						iconWrapper.appendChild( modal );

						ReactDOM.render(
							<Comment { ...comment } comments={data} />,
							modal
						);
					} else {
						document.querySelector( `#comment-modal-${ comment.id }` ).remove();
					}

					isOpen = ! isOpen;
				} );

				innerElement.appendChild( iconWrapper );
			} );
		} );

	document.addEventListener( 'click', ( e ) => {
		if ( ! isActive ) {
			return;
		}

		const myElement = e.srcElement.closest( '.elementor-widget' );

		const iconWrapper = document.createElement( 'div' );
		const icon = document.createElement( 'div' );
		const modal = document.createElement( 'div' );
		iconWrapper.appendChild( modal );

		iconWrapper.classList.add( 'comment-icon-wrapper' );
		icon.classList.add( 'comment-icon' );

		icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="27" height="38" fill="none"><g filter="url(#filter0_f)"><ellipse cx="14" cy="33" fill="#000" fill-opacity=".12" rx="6" ry="3"/></g><mask id="a" width="25" height="33" x="1" y="1.375" fill="#000" maskUnits="userSpaceOnUse"><path fill="#fff" d="M1 1.375h25v33H1z"/><path fill-rule="evenodd" d="M19.905 23.825c2.787-2.161 4.595-5.645 4.595-9.575 0-6.558-5.037-11.875-11.25-11.875S2 7.692 2 14.25c0 3.93 1.808 7.414 4.595 9.575 2.124 1.69 5.12 4.358 5.794 8.658.067.43.426.763.861.763s.794-.333.861-.763c.673-4.3 3.67-6.968 5.794-8.658z" clip-rule="evenodd"/></mask><path fill="#4AB7F4" fill-rule="evenodd" d="M19.905 23.825c2.787-2.161 4.595-5.645 4.595-9.575 0-6.558-5.037-11.875-11.25-11.875S2 7.692 2 14.25c0 3.93 1.808 7.414 4.595 9.575 2.124 1.69 5.12 4.358 5.794 8.658.067.43.426.763.861.763s.794-.333.861-.763c.673-4.3 3.67-6.968 5.794-8.658z" clip-rule="evenodd"/><path fill="url(#paint0_linear)" d="M19.905 23.825l-.613-.79-.009.007.622.783zm-13.31 0l.622-.783-.01-.007-.612.79zm5.794 8.658l-.988.155.988-.155zm1.722 0l.988.155-.988-.155zm6.407-7.868c3.03-2.35 4.982-6.126 4.982-10.365h-2c0 3.62-1.665 6.813-4.207 8.785l1.225 1.58zM25.5 14.25c0-7.059-5.434-12.875-12.25-12.875v2c5.61 0 10.25 4.817 10.25 10.875h2zM13.25 1.375C6.434 1.375 1 7.191 1 14.25h2C3 8.192 7.64 3.375 13.25 3.375v-2zM1 14.25c0 4.24 1.952 8.015 4.982 10.365l1.226-1.58C4.665 21.062 3 17.87 3 14.25H1zm12.377 18.078c-.737-4.703-4.013-7.578-6.16-9.286l-1.245 1.566c2.102 1.671 4.819 4.133 5.429 8.03l1.976-.31zm-.127-.082c.046 0 .081.02.1.036a.08.08 0 01.027.046l-1.976.31c.137.873.88 1.608 1.849 1.608v-2zm-.127.082a.08.08 0 01.027-.046.154.154 0 01.1-.036v2c.97 0 1.712-.735 1.85-1.608l-1.977-.31zm6.16-9.286c-2.147 1.708-5.423 4.583-6.16 9.286l1.976.31c.61-3.897 3.327-6.359 5.429-8.03l-1.245-1.566z" mask="url(#a)"/><defs><linearGradient id="paint0_linear" x1="13.25" x2="13.25" y1="2.375" y2="33.246" gradientUnits="userSpaceOnUse"><stop stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity=".35"/></linearGradient><filter id="filter0_f" width="16" height="10" x="6" y="28" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur" stdDeviation="1"/></filter></defs></svg>';

		iconWrapper.appendChild( icon );

		myElement.appendChild( iconWrapper );

		ReactDOM.render(
			<NewComment elementId={myElement.getAttribute( 'data-id' )} />,
			modal
		);

		isActive = false;
		// ReactDOM.render(
		// 	<Comment { ...comment } comments={data} />,
		// 	modal
		// );
	} );
} );
