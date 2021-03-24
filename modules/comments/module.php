<?php
namespace Elementor\Modules\Comments;

use Elementor\Core\Base\Module as BaseModule;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Module extends BaseModule {
	public function get_name() {
		return 'comments';
	}

	public function register_elementor_rest_field() {
//		register_rest_field(
//			'comment',
//			'type',
//			[
//				'update_callback' => function( $request_value, $object ) {
//					var_dump( $request_value, $object );
//				},
//			]
//		);
	}

	public function __construct() {
		add_action( 'rest_api_init', [ $this, 'register_elementor_rest_field' ] );
	}
}
