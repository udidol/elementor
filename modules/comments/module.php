<?php
namespace Elementor\Modules\Comments;

use Elementor\Plugin;
use Elementor\Core\Utils\Collection;
use Elementor\Core\Base\App as BaseApp;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Module extends BaseApp {
	public function get_name() {
		return 'comments';
	}

	protected function get_data() {
		$comments = new Collection( get_comments( [
			'parent' => 0,
			'post'   => get_queried_object_id(),
		] ) );

		$comments = $comments
			->map( function ( $comment ) {
				return $this->transform_data( $comment );
			} )
			->filter( function ( $comment ) {
				return $comment['element_id'];
			} )
		;

		return [
			'comments' => $comments->all(),
			'post_id' => get_queried_object_id(),
		];
	}

	private function transform_data($comment) {
		$children = get_comments( [
			'parent' => $comment->comment_ID,
		] );

		if ( ! $children ) {
			$children = [];
		}

		return [
			'id'          => (int) $comment->comment_ID,
			'post'        => (int) $comment->comment_post_ID,
			'parent'      => (int) $comment->comment_parent,
			'user'        => (int) $comment->user_id,
			'author_name' => $comment->comment_author,
			'date'        => mysql_to_rfc3339( $comment->comment_date ),
			'content'     => [
				'raw' => $comment->comment_content,
			],
			'link'        => get_comment_link( $comment ),
			'element_id'  => get_comment_meta( $comment->comment_ID, '_elementor_element_id', true ),
			'children' => array_map( function ( $child ) {
				return $this->transform_data( $child );
			}, $children ),
		];
	}

	public function add_template() {
		Plugin::$instance->common->add_template( __DIR__ . '/template.php' );
	}

	public function __construct() {
		add_action( 'wp_enqueue_scripts', function () {
			wp_enqueue_script(
				'elementor-comments',
				$this->get_js_assets_url( 'elementor-comments' ),
				[
					'jquery',
					'react',
					'react-dom',
				],
				ELEMENTOR_VERSION,
				true
			);

			wp_enqueue_style(
				'elementor-comments',
				ELEMENTOR_URL . 'modules/comments/assets/scss/style.css',
				[],
				ELEMENTOR_VERSION
			);
		} );

		add_action( 'wp_head', function() {
			?>
			<div id="elementor-comments-navigator"></div>
			<?php
		} );

		add_filter( 'elementor/common/config', function ( $config ) {
			return $config + $this->get_data();
		} );

		if ( function_exists( 'register_rest_field' ) ) {
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
		}


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
						$user->user_email, // user email
						'', // title
						'<div class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #FFFFFF;"><style type="text/css">body{margin: 0;padding: 0;}table,td,tr{vertical-align: top;border-collapse: collapse;}*{line-height: inherit;}a[x-apple-data-detectors=true]{color: inherit !important;text-decoration: none !important;}</style><style id="media-query" type="text/css">@media (max-width: 525px){.block-grid,.col{min-width: 320px !important;max-width: 100% !important;display: block !important;}.block-grid{width: 100% !important;}.col{width: 100% !important;}.col_cont{margin: 0 auto;}img.fullwidth,img.fullwidthOnMobile{max-width: 100% !important;}.no-stack .col{min-width: 0 !important;display: table-cell !important;}.no-stack.two-up .col{width: 50% !important;}.no-stack .col.num2{width: 16.6% !important;}.no-stack .col.num3{width: 25% !important;}.no-stack .col.num4{width: 33% !important;}.no-stack .col.num5{width: 41.6% !important;}.no-stack .col.num6{width: 50% !important;}.no-stack .col.num7{width: 58.3% !important;}.no-stack .col.num8{width: 66.6% !important;}.no-stack .col.num9{width: 75% !important;}.no-stack .col.num10{width: 83.3% !important;}.video-block{max-width: none !important;}.mobile_hide{min-height: 0px;max-height: 0px;max-width: 0px;display: none;overflow: hidden;font-size: 0px;}.desktop_hide{display: block !important;max-height: none !important;}}</style><style id="icon-media-query" type="text/css">@media (max-width: 525px){.icons-inner{text-align: center;}.icons-inner td{margin: 0 auto;}}</style><table bgcolor="#FFFFFF" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="table-layout: fixed; vertical-align: top; min-width: 320px; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; width: 100%;" valign="top" width="100%"><tbody><tr style="vertical-align: top;" valign="top"><td style="word-break: break-word; vertical-align: top;" valign="top"><div style="background-color:transparent;"><div class="block-grid" style="min-width: 320px; max-width: 505px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;"><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><div class="col num12" style="min-width: 320px; max-width: 505px; display: table-cell; vertical-align: top; width: 505px;"><div class="col_cont" style="width:100% !important;"><div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"><div align="center" class="img-container center autowidth" style="padding-right: 25px;padding-left: 25px;"><div style="font-size:1px;line-height:25px"> </div><img align="center" alt="elementor logo" border="0" class="center autowidth" src="https://elementor.com/cdn-cgi/image/f=auto,w=64,h=64/marketing/wp-content/uploads/sites/14/2020/03/Logox2.png" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 64px; display: block;" title="elementor logo" width="64"/><div style="font-size:1px;line-height:25px"> </div></div><table cellpadding="0" cellspacing="0" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" valign="top" width="100%"><tr style="vertical-align: top;" valign="top"><td align="center" style="word-break: break-word; vertical-align: top; padding-bottom: 0px; padding-left: 0px; padding-right: 0px; padding-top: 0px; text-align: center; width: 100%;" valign="top" width="100%"><h1 style="color:#555555;direction:ltr;font-family:"Roboto", Tahoma, Verdana, Segoe, sans-serif;font-size:23px;font-weight:normal;letter-spacing:normal;line-height:180%;text-align:center;margin-top:0;margin-bottom:0;"><strong>{{display_name}}</strong></h1></td></tr></table><table cellpadding="0" cellspacing="0" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" valign="top" width="100%"><tr style="vertical-align: top;" valign="top"><td align="center" style="word-break: break-word; vertical-align: top; padding-bottom: 0px; padding-left: 0px; padding-right: 0px; padding-top: 0px; text-align: center; width: 100%;" valign="top" width="100%"><h1 style="color:#555555;direction:ltr;font-family:"Roboto", Tahoma, Verdana, Segoe, sans-serif;font-size:23px;font-weight:normal;letter-spacing:normal;line-height:150%;text-align:center;margin-top:0;margin-bottom:0;">mentioned you in a comment on<br/></h1></td></tr></table><table cellpadding="0" cellspacing="0" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" valign="top" width="100%"><tr style="vertical-align: top;" valign="top"><td align="center" style="word-break: break-word; vertical-align: top; padding-bottom: 0px; padding-left: 0px; padding-right: 0px; padding-top: 0px; text-align: center; width: 100%;" valign="top" width="100%"><h1 style="color:#555555;direction:ltr;font-family:"Roboto", Tahoma, Verdana, Segoe, sans-serif;font-size:23px;font-weight:normal;letter-spacing:normal;line-height:150%;text-align:center;margin-top:0;margin-bottom:0;"><strong>{{page_name}}:</strong></h1></td></tr></table><div style="color:#555555;font-family:"Roboto", Tahoma, Verdana, Segoe, sans-serif;line-height:1.5;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;"><div class="txtTinyMce-wrapper" style="line-height: 1.5; font-size: 12px; color: #555555; font-family: "Roboto", Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 18px;"><p style="font-size: 14px; line-height: 1.5; word-break: break-word; text-align: center; mso-line-height-alt: 21px; margin: 0;">"{{comment_content}}"</p></div></div><div align="center" class="button-container" style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;"><a href="{{comment_link}}" style="-webkit-text-size-adjust: none; text-decoration: none; display: inline-block; color: #000000; background-color: transparent; border-radius: 5px; -webkit-border-radius: 5px; -moz-border-radius: 5px; width: auto; width: auto; border-top: 2px solid #000000; border-right: 2px solid #000000; border-bottom: 2px solid #000000; border-left: 2px solid #000000; padding-top: 5px; padding-bottom: 5px; font-family: "Roboto", Tahoma, Verdana, Segoe, sans-serif; text-align: center; mso-border-alt: none; word-break: keep-all;" target="_blank"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;letter-spacing:undefined;"><span style="font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;">View the comment</span></span></a></div></div></div></div></div></div></div><div style="background-color:transparent;"><div class="block-grid" style="min-width: 320px; max-width: 505px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;"><div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"><div class="col num12" style="min-width: 320px; max-width: 505px; display: table-cell; vertical-align: top; width: 505px;"><div class="col_cont" style="width:100% !important;"><div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"><table cellpadding="0" cellspacing="0" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" valign="top" width="100%"><tr style="vertical-align: top;" valign="top"><td align="center" style="word-break: break-word; vertical-align: top; padding-top: 5px; padding-right: 0px; padding-bottom: 5px; padding-left: 0px; text-align: center;" valign="top"></td></tr></table></div></div></div></div></div></div></td></tr></tbody></table></div></body>' . get_comment_link( $object->comment_ID )
					);
				}
			});

		add_action( 'admin_bar_menu', function ( $wp_admin_bar ) {
			$wp_admin_bar->add_node( [
				'id'     => 'elementor_comments',
				'title'  => __( 'Comments', 'elementor-beta' ),
				'parent' => 'top-secondary',
				'href'   => '#',
			] );
		} );

		$this->add_template();
	}
}
