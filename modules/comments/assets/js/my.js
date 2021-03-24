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

	useEffect(() => {
		$( '#comment-open' ).click(function() {
			$( "svg" ).toggle();
		});
	}, [])

	if ( closed ) {
		return '';
	}

	return (
		! data ? ( <div className="comment-modal">
			<div>
				<input placeholder="Add a comment. Use @ to mention" className="comment-modal-input" style={{ width: '100%' }} value={input} onChange={( e ) => setInput( e.target.value )} />
				<div id="comment-box-left">
					<span id="comment-open">
					<svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 5.375H9.75V3.875C9.75 1.805 8.07 0.125 6 0.125C3.93 0.125 2.25 1.805 2.25 3.875H3.75C3.75 2.63 4.755 1.625 6 1.625C7.245 1.625 8.25 2.63 8.25 3.875V5.375H1.5C0.675 5.375 0 6.05 0 6.875V14.375C0 15.2 0.675 15.875 1.5 15.875H10.5C11.325 15.875 12 15.2 12 14.375V6.875C12 6.05 11.325 5.375 10.5 5.375ZM1.5 14.375V6.875H10.5V14.375H1.5ZM7.5 10.625C7.5 11.45 6.825 12.125 6 12.125C5.175 12.125 4.5 11.45 4.5 10.625C4.5 9.8 5.175 9.125 6 9.125C6.825 9.125 7.5 9.8 7.5 10.625Z" fill="black" fill-opacity="0.54"/></svg>
					<svg style="display: none" xmlns="http://www.w3.org/2000/svg" width="12" height="16" fill="none"><path fill="#000" fill-opacity=".54" fill-rule="evenodd" d="M12.75 6.375h.75c.825 0 1.5.675 1.5 1.5v7.5c0 .825-.675 1.5-1.5 1.5h-9c-.825 0-1.5-.675-1.5-1.5v-7.5c0-.825.675-1.5 1.5-1.5h.75v-1.5c0-2.07 1.68-3.75 3.75-3.75 2.07 0 3.75 1.68 3.75 3.75v1.5zM9 2.625a2.247 2.247 0 00-2.25 2.25v1.5h4.5v-1.5A2.247 2.247 0 009 2.625zm-4.5 12.75v-7.5h9v7.5h-9zm6-3.75c0 .825-.675 1.5-1.5 1.5s-1.5-.675-1.5-1.5.675-1.5 1.5-1.5 1.5.675 1.5 1.5z" clip-rule="evenodd"/></svg>
				Public</span>
				</div>
				<div id="comment-box-right">
					<button className="comment-modal-cancel" onClick={( e ) => close( e )}>Cancel</button>
					<button className="comment-modal-submit" onClick={( e ) => submit( e )}>Submit</button>
				</div>
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
