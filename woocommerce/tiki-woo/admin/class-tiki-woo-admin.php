<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://myiki.com
 * @since      1.0.0
 *
 * @package    Tiki_Woo
 * @subpackage Tiki_Woo/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Tiki_Woo
 * @subpackage Tiki_Woo/admin
 * @author     TIKI Team <ricardo@mytiki.com>
 */
class Tiki_Woo_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $tiki_woo    The ID of this plugin.
	 */
	private $tiki_woo;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $tiki_woo       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $tiki_woo, $version ) {

		$this->tiki_woo = $tiki_woo;
		$this->version     = $version;

	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {
		wp_enqueue_style( 'wp-color-picker' );
	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {
		wp_enqueue_script(
			$this->tiki_woo,
			plugin_dir_url( __FILE__ ) . 'js/tiki-woo-admin.js',
			array( 'jquery' ),
			$this->version,
			false
		);
	}

	public function admin_menu() {
		add_submenu_page(
			'woocommerce',
			'TIKI For WooCommerce',
			'TIKI',
			'manage_options',
			'tiki-woo',
			array( $this, 'display' ),
		);
	}

	public function display() {
		$active_tab = isset( $_GET['tab'] ) ? $_GET['tab'] : 'general';
		require_once 'partials/tiki-woo-admin-display.php';
	}

	public function settings_init() {
		$this->init_general_options();
		// $this->init_coupons_options();
		// $this->init_loyalty_options();
		// $this->init_cookies_options();
	}

	public function init_general_options() {
		$options = get_option( 'tiki_woo_general', array() );

		register_setting( 'tiki_woo_general', 'tiki_woo_general' );

		add_settings_section(
			'tiki_woo_general_sdk',
			__( 'TIKI SDK Configuration', 'tiki_woo' ),
			array( $this, 'tiki_woo_general_sdk_desc' ),
			'tiki_woo_general',
			array(
				'show_button' => empty( $options['publishing_id'] ),
			)
		);

		add_settings_field(
			'publishing_id',
			__( 'Publishing ID', 'tiki_woo' ),
			array( $this, 'render_input_field' ),
			'tiki_woo_general',
			'tiki_woo_general_sdk',
			array(
				'description' => 'The publishing id',
				'label_for' => 'publishing_id',
				'options'   => $options,
				'option_name' => 'tiki_woo_general',
			)
		);

		add_settings_field(
			'private_key',
			__( 'Private Key ID', 'tiki_woo' ),
			array( $this, 'render_input_field' ),
			'tiki_woo_general',
			'tiki_woo_general_sdk',
			array(
				'label_for' => 'private_key',
				'options'   => $options,
				'option_name' => 'tiki_woo_general',
			)
		);

		add_settings_field(
			'secret',
			__( 'Secret', 'tiki_woo' ),
			array( $this, 'render_input_field' ),
			'tiki_woo_general',
			'tiki_woo_general_sdk',
			array(
				'label_for' => 'secret',
				'options'   => $options,
				'type'      => 'password',
				'option_name' => 'tiki_woo_general',
			)
		);
	}
	// public function init_coupons_options() {
	// 	register_setting( 'tiki_woo_coupons', 'tiki_woo_coupons_options' );

	// 	// Register a new section in the "wporg" page.
	// 	add_settings_section(
	// 		'wporg_section_developers',
	// 		__( 'The Matrix has you.', 'tiki_woo' ),
	// 		array($this,'wporg_section_developers_callback'),
	// 		'tiki_woo'
	// 	);

	// 	add_settings_field(
	// 		'wporg_field_pill',
	// 		__( 'Pill', 'wporg' ),
	// 		array($this,'wporg_field_pill_cb'),
	// 		'tiki_woo',
	// 		'wporg_section_developers',
	// 		array(
	// 			'label_for'         => 'wporg_field_pill',
	// 			'class'             => 'wporg_row',
	// 			'wporg_custom_data' => 'custom',
	// 		)
	// 	);
	// }
	// public function init_loyalty_options() {
	// 	register_setting( 'tiki_woo_loyalty', 'tiki_woo_loyalty_options' );

	// 	// Register a new section in the "wporg" page.
	// 	add_settings_section(
	// 		'wporg_section_developers',
	// 		__( 'The Matrix has you.', 'tiki_woo' ),
	// 		array($this,'wporg_section_developers_callback'),
	// 		'tiki_woo'
	// 	);

	// 	add_settings_field(
	// 		'wporg_field_pill',
	// 		__( 'Pill', 'wporg' ),
	// 		array($this,'wporg_field_pill_cb'),
	// 		'tiki_woo',
	// 		'wporg_section_developers',
	// 		array(
	// 			'label_for'         => 'wporg_field_pill',
	// 			'class'             => 'wporg_row',
	// 			'wporg_custom_data' => 'custom',
	// 		)
	// 	);
	// }
	// public function init_cookies_options() {
	// 	register_setting( 'tiki_woo_cookies', 'tiki_woo_cookies_options' );

	// 	// Register a new section in the "wporg" page.
	// 	add_settings_section(
	// 		'wporg_section_developers',
	// 		__( 'The Matrix has you.', 'tiki_woo' ),
	// 		array($this,'wporg_section_developers_callback'),
	// 		'tiki_woo'
	// 	);

	// 	add_settings_field(
	// 		'wporg_field_pill',
	// 		__( 'Pill', 'wporg' ),
	// 		array($this,'wporg_field_pill_cb'),
	// 		'tiki_woo',
	// 		'wporg_section_developers',
	// 		array(
	// 			'label_for'         => 'wporg_field_pill',
	// 			'class'             => 'wporg_row',
	// 			'wporg_custom_data' => 'custom',
	// 		)
	// 	);
	// }

	public function tiki_woo_general_sdk_desc( $args ) {
		if ( $args['show_button'] ) {
			?>
			<div class="button-primary">TIKI Console</div>
			<?php
		}
	}

	public function render_input_field( $args ) {
		$label       = $args['label_for'];
		$value       = isset( $args['options'][ $label ] ) ? $args['options'][ $label ] : '';
		$name        = $args['option_name'] . '[' . $label . ']';
		$type        = isset( $args['type'] ) ? $args['type'] : 'text';
		?>
			<input 
				id="<?php echo esc_attr( $label ); ?>"
				name="<?php echo esc_attr( $name ); ?>"
				value="<?php echo esc_attr( $value ); ?>"
				type="<?php echo esc_attr( $type ); ?>"
				class="regular-text" >
			<?php
			if ( isset( $args['description'] ) ) {
				?>
				<p class='description' id='$label-description'><?php echo esc_html( $args['description'] ); ?></p>
				<?php
			}
	}

	public function plugin_links( $links ) {
		$url = get_admin_url() . 'admin.php?page=tiki-woo';
		array_unshift( $links, '<a href="' . $url . '">' . __( 'Settings', 'tiki-woo' ) . '</a>');
		return $links;
	}

}
