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

	return (
		<div className="comment-modal" id={`comment-modal-${ props.id }`}>
			<div>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<img src={props.author_avatar_urls[ 48 ]} style={{ height: '30px', 	borderRadius: '300px' }}/>
					<span style={{ marginLeft: '10px' }}> {props.author_name} </span>
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
