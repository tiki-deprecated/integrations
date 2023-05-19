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
			__( 'SDK Configuration', 'tiki_woo' ),
			array( $this, 'tiki_woo_general_sdk_desc' ),
			'tiki_woo_general',
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

		add_settings_section(
			'tiki_woo_general_ui',
			__( 'UI Personalization', 'tiki_woo' ),
			array( $this, 'tiki_woo_general_sdk_desc' ),
			'tiki_woo_general',
		);

		add_settings_field(
			'Primary text color',
			__( 'Primary text color', 'tiki_woo' ),
			array( $this, 'render_input_field' ),
			'tiki_woo_general',
			'tiki_woo_general_ui',
			array(
				'description' => 'Primary text color',
				'label_for' => 'Primary text color',
				'options'   => $options,
				'option_name' => 'tiki_woo_general',
			)
		);

		add_settings_field(
			'Secondary text color',
			__( 'Secondary text color', 'tiki_woo' ),
			array( $this, 'render_input_field' ),
			'tiki_woo_general',
			'tiki_woo_general_ui',
			array(
				'description' => 'Secondary text color',
				'label_for' => 'Secondary text color',
				'options'   => $options,
				'option_name' => 'tiki_woo_general',
			)
		);

		add_settings_field(
			'Primary background color',
			__( 'Primary background color', 'tiki_woo' ),
			array( $this, 'render_input_field' ),
			'tiki_woo_general',
			'tiki_woo_general_ui',
			array(
				'description' => 'The Primary background color',
				'label_for' => 'Primary background color',
				'options'   => $options,
				'option_name' => 'tiki_woo_general',
			)
		);

		add_settings_field(
			'Secondary background color',
			__( 'Secondary background color', 'tiki_woo' ),
			array( $this, 'render_input_field' ),
			'tiki_woo_general',
			'tiki_woo_general_ui',
			array(
				'description' => 'The Secondary background color',
				'label_for' => 'Secondary background color',
				'options'   => $options,
				'option_name' => 'tiki_woo_general',
			)
		);

		add_settings_field(
			'Accent color',
			__( 'Accent color', 'tiki_woo' ),
			array( $this, 'render_input_field' ),
			'tiki_woo_general',
			'tiki_woo_general_ui',
			array(
				'description' => 'Accent color',
				'label_for' => 'Accent color',
				'options'   => $options,
				'option_name' => 'tiki_woo_general',
			)
		);

		add_settings_field(
			'Font Family',
			__( 'Font Family', 'tiki_woo' ),
			array( $this, 'render_input_field' ),
			'tiki_woo_general',
			'tiki_woo_general_ui',
			array(
				'description' => 'Font Family',
				'label_for' => 'Font Family',
				'options'   => $options,
				'option_name' => 'tiki_woo_general',
			)
		);
	}

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
