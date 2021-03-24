<?php
namespace Elementor\Modules\Comments;

use Elementor\Core\Utils\Collection;
use Elementor\Core\Base\App as BaseApp;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Module extends BaseApp {
	public function get_name() {
		return 'comments';
	}

//	protected function get_init_settings() {
//		$comments = new Collection( get_comments( [
//			'parent' => 0,
//			'post' => 2539,
//		] ) );
//
//		$comments = $comments
//			->map( function ( $comment ) {
//				return [
//					'id' => (int) $comment->comment_ID,
//					'post' => (int) $comment->comment_post_ID,
//					'parent' => (int) $comment->comment_parent,
//					'user' => (int) $comment->user_id,
//					'author_name' => $comment->comment_author,
//					'date' => mysql_to_rfc3339( $comment->comment_date ),
//					'content' => [
//						'raw' => $comment->comment_content,
//					],
//					'link' => get_comment_link( $comment ),
//					'widget' => get_comment_meta( $comment->comment_ID, '_elementor_widget', true ),
//				];
//			} )
//			->filter( function ( $comment ) {
//				return $comment['widget'];
//			} );
//
//		return [
//			'comments' => $comments->all(),
//		];
//	}


	public function __construct() {
//		add_action( 'wp_enqueue_scripts', function () {
//			wp_register_script(
//				'elementor-comments',
//				$this->get_js_assets_url( 'admin' ),
//				[
//					'elementor-common',
//				],
//				ELEMENTOR_VERSION,
//				true
//			);
//
//			wp_enqueue_script( 'elementor-comments' );
//
//			$this->print_config();
//		} );

		add_action( 'rest_api_init', function () {
			register_rest_field(
				'comment',
				'element_id',
				[
					'get_callback' => function ( $object ) {
						return get_comment_meta( $object['id'], '_elementor_element_id', true );
					},
					'update_callback' => function( $request_value, $object ) {
						update_comment_meta( $object->comment_ID, '_elementor_element_id', $request_value );
					},
				]
			);

			register_rest_field(
				'comment',
				'resolved',
				[
					'get_callback' => function ( $object ) {
						return (bool) get_comment_meta( $object['id'], '_elementor_resolved', true );
					},
					'update_callback' => function( $request_value, $object ) {
						update_comment_meta( $object->comment_ID, '_elementor_resolved', (bool) $request_value );
					},
				]
			);

			add_action('rest_after_insert_comment', function ( $object ) {
				if ( ! get_comment_meta( $object->comment_ID, '_elementor_element_id', true ) ) {
					return;
				}

				$content = $object->comment_content;
				$matches = [];
				preg_match_all( '/\@[^\s]+/', $content, $matches );

				$mentioned_users = ( new Collection( $matches[0] ) )
					->unique();

				foreach ( $mentioned_users as $mentioned_user ) {
					$username = trim( $mentioned_user, '@' );

					$user = get_user_by( 'login', $username );

					if ( ! $user ) {
						continue;
					}

					wp_mail(
						$user->user_email,
						'Some email',
						'New something. ' . get_comment_link( $object->comment_ID )
					);
				}
			});
		} );

	}
}
