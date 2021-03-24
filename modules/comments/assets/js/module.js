import CommentsNavigator from './comments-navigator';

export default class extends elementorModules.Module {
	onInit() {
		elementorCommon.elements.$window.on( 'elementor:loaded', () => {
			elementor.on( 'panel:init', () => {
				this.commentsNavigator = new CommentsNavigator();

				this.commentsNavigator.initModal();
			} );
		} );
	}
}
