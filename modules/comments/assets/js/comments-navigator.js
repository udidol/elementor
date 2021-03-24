export default class extends elementorModules.ViewModule {
	getDefaultSettings() {
		return {
			selectors: {
				editorPanelFooterToggle: '#elementor-panel-footer-comments',
				adminBarToggle: '#wp-admin-bar-elementor_comments',
				closeButton: '#e-comments__close',
			},
		};
	}

	getDefaultElements() {
		const elements = {};
		const selectors = this.getSettings( 'selectors' );

		if ( elementorFrontend.isEditMode() ) {
			elements.$editorPanelFooterToggle = jQuery( selectors.editorPanelFooterToggle );
		} else {
			elements.$adminBarToggle = jQuery( selectors.adminBarToggle );
		}

		elements.$closeButton = jQuery( selectors.closeButton );

		return elements;
	}

	bindEvents() {
		if ( elementorFrontend.isEditMode() ) {
			this.elements.$editorPanelFooterToggle.on( 'click', () => this.toggleComments() );
		} else {
			this.elements.$adminBarToggle.on( 'click', () => this.toggleComments() );
		}
		this.elements.$closeButton.on( 'click', () => this.modal.hide() );
	}

	getModalContent() {
		const headerContent = this.getModalHeader(),
			container = jQuery( '<div/>', { class: '.e-comments-container' } );

		container.html( headerContent );

		return jQuery( '<div/>', { class: '.e-comments-container' } ).html( headerContent );
	}

	getModalHeader() {
		return Marionette.Renderer.render( Marionette.TemplateCache.get( '#tmpl-e-comments' ) );
	}

	initModal() {
		const modalOptions = {
			id: 'e-comments',
			closeButton: false,
			message: this.getModalContent(),
			hide: {
				onOutsideClick: false,
				onEscKeyPress: true,
				onBackgroundClick: false,
			},
		};

		this.modal = elementorCommon.dialogsManager.createWidget( 'simple', modalOptions );

		this.makeModalDraggable();
	}

	makeModalDraggable() {
		const $modalWidgetContent = this.modal.getElements( 'widget' );

		$modalWidgetContent.draggable( {
			iframeFix: true,
			handle: '#e-comments__header',
			stop: () => {
				$modalWidgetContent.height( '' );
			},
		} );

		$modalWidgetContent.css( 'position', 'absolute' );
	}

	getModal() {
		if ( ! this.modal ) {
			this.initModal();
		}

		return this.modal;
	}

	toggleComments() {
		if ( this.modal.isVisible() ) {
			this.modal.hide();
		} else {
			this.modal.show();
		}
	}
}
