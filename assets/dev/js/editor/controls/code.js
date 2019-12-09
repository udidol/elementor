var ControlBaseDataView = require( 'elementor-controls/base-data' ),
	ControlCodeEditorItemView;

ControlCodeEditorItemView = ControlBaseDataView.extend( {
	ui: function() {
		var ui = ControlBaseDataView.prototype.ui.apply( this, arguments );

		ui.editor = '.elementor-code-editor';

		return ui;
	},

	onReady: function() {
		var self = this;

		if ( 'undefined' === typeof CodeMirror ) {
			return;
		}

		// Check for user preference and user settings for light/dark theme
		const uiTheme = elementor.settings.editorPreferences.model.get( 'ui_theme' ),
			userPrefersDark = matchMedia( '(prefers-color-scheme: dark)' ).matches;

		// Initialize Codemirror on the code control textarea element
		self.editor = wp.CodeMirror.fromTextArea( this.ui.editor[ 0 ], {
			mode: 'text/css',
			lint: true,
			gutters: [ 'CodeMirror-lint-markers', 'CodeMirror-linenumbers', 'CodeMirror-foldgutter' ],
			foldGutter: true,
			lineNumbers: true,
			lineWrapping: true,
			autoRefresh: true, // Loads the control's saved value into the editor when it becomes visible
			autoCloseTags: true,
			styleActiveLine: true,
		} );

		jQuery( self.editor.container ).addClass( 'elementor-input-style elementor-code-editor' );

		// Set the editor's color scheme according to user's preference
		if ( 'dark' === uiTheme || ( 'auto' === uiTheme && userPrefersDark ) ) {
			self.editor.setOption( 'theme', 'elementor-dark' );
		} else {
			self.editor.setOption( 'theme', 'elementor-light' );
		}

		// TODO: add the word 'selector' to the autocomplete system

		self.editor.setValue( self.getControlValue(), -1 ); // -1 =  move cursor to the start

		self.editor.on( 'change', function() {
			self.setValue( self.editor.getValue() );
		} );

		// Add triggers for the autocomplete function to the CodeMirror instance
		self.editor.on( 'keyup', function( cm, event ) {
			if ( ! cm.state.completionActive && // Enables keyboard navigation in autocomplete list
				! self.editor.excludedIntelliSenseKeys[ ( event.keyCode || event.which ).toString() ] ) { // Do not open autocomplete list on these keys being hit
				wp.CodeMirror.commands.autocomplete( cm, null, { completeSingle: false } ); // trigger autocomplete
			}
		} );
	},
} );

module.exports = ControlCodeEditorItemView;
