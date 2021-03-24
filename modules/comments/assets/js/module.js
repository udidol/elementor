import CommentsNavigator from './comments-navigator';

export default class extends elementorModules.Module {
	onInit() {
		// Load in Editor
		elementorCommon.elements.$window.on( 'elementor:loaded', () => {
			elementor.on( 'panel:init', () => {
				this.initNavigator();
			} );
		} );

		// Load in Frontend
		elementorCommon.elements.$window.on( 'elementor/frontend/init', () => {
			if ( ! elementorFrontend.isEditMode() ) {
				this.initNavigator();
			}
		} );
	}

	initNavigator() {
		this.commentsNavigator = new CommentsNavigator();

		this.commentsNavigator.initModal();
	}
}
