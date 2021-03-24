<?php
namespace Elementor\Modules\Comments;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

?>
<script type="text/template" id="tmpl-e-comments">
	<div id="e-comments__elements">
		<# comments.forEach( ( comment ) => { #>
			<div class="e-comments__comment-item">
				<div class="e-comments__comment-item-id">{{{ comment.id }}}</div>
				<div class="e-comments__comment_meta">
					<span class="e-comments__comment-author">{{{ comment.author }}}</span>
					<span class="e-comments__comment-timestamp">{{{ comment.timestamp }}}</span>
					<p class="e-comments__comment-excerpt">{{ comment.content }}</p>
					<p class="e-comments__num-replies">{{{ comment.numReplies }}}</p>
				</div>
			</div>
		<#} ); #>
	</div>
</script>

<script type="text/template" id="tmpl-e-comments-header">
	<div id="e-comments__header">
		<span class="e-comments-empty"></span>
		<div id="e-comments__header__title"><?php echo __( 'Comments', 'elementor' ); ?></div>
		<i id="e-comments__close" class="eicon-close"></i>
	</div>
</script>

<script type="text/template" id="tmpl-e-comments-footer">
	<div id="e-comments__footer">
		<div id="e-comments__footer-icons">
			<i id="e-comments__toggle-show" class="eicon-preview-medium"></i>
			<img alt="<?php echo __( 'Notifications', 'elementor' ); ?>" id="e-comments__notifications" src="<?php echo ELEMENTOR_URL . 'modules/comments/assets/images/bell.svg'; ?>" />
			<img alt="<?php echo __( 'Add User', 'elementor' ); ?>" id="e-comments__add-user" src="<?php echo ELEMENTOR_URL . 'modules/comments/assets/images/add-user.svg'; ?>" />
		</div>
		<a href="#" id="e-comments__add-comment">Add Comment</a>
	</div>
</script>

<script type="text/template" id="tmpl-e-comments__elements">
	<div class="e-comments__comment-item">
		<div class="e-comments__comment-item-id">{{{ id }}}</div>
		<div class="e-comments__comment_meta">
			<span class="e-comments__comment-author">{{{ author }}}</span>
			<span class="e-comments__comment-timestamp">{{{ timestamp }}}</span>
			<p class="e-comments__comment-excerpt">{{ content }}</p>
			<p class="e-comments__num-replies">{{{ numReplies }}}</p>
		</div>
	</div>
</script>

<script type="text/template" id="tmpl-e-comments--empty">
	<div id="e-comments__empty">
		<img alt="<?php echo __( 'Comment Icon', 'elementor' ); ?>" id="e-comments__no-comments-icon" src="<?php echo ELEMENTOR_URL . 'modules/comments/assets/images/comment.svg'; ?>" />
		<div id="e-comments__no-comments-title"><?php echo __( 'Start Commenting!', 'elementor' ); ?></div>
		<div id="e-comments__no-comments-message">
			<p><?php echo __( 'Give feedback, ask a question or just leave a note of appreciation. Click anywhere on the page to leave a comment.', 'elementor' ); ?></p>
			<p><?php echo sprintf( __( 'You can also leave notes to self (only you can see) by clicking on the <img id="e-comments__unlock" src="%s" /> icon.', 'elementor' ), ELEMENTOR_URL . 'modules/comments/assets/images/unlock.svg' ); ?></p>
		</div>
	</div>
</script>
