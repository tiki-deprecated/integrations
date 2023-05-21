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
		wp_enqueue_script( 'wp-color-picker' );
		wp_enqueue_script(
			$this->tiki_woo,
			plugin_dir_url( __FILE__ ) . 'assets/tiki-woo-admin.js',
			array( 'jquery', 'wp-color-picker' ),
			$this->version,
			true
		);
		if ( ! did_action( 'wp_enqueue_media' ) ) {
			wp_enqueue_media();
		}
	}

	public function admin_menu() {
		add_submenu_page(
			'woocommerce-marketing',
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
		$this->init_coupons_options();
		$this->init_loyalty_options();
		$this->init_cookies_options();
	}

	public function init_coupons_options() {
		$options = get_option( 'tiki_woo_coupons', array() );

		register_setting( 'tiki_woo_coupons', 'tiki_woo_coupons' );

		add_settings_section(
			'tiki_woo_coupons',
			__( 'Coupons Settings', 'tiki_woo' ),
			array( $this, 'tiki_woo_coupon_desc' ),
			'tiki_woo_coupons',
		);

		add_settings_field(
			'discount_type',
			__( 'Discount Type', 'tiki_woo' ),
			array( $this, 'render_select_field' ),
			'tiki_woo_coupons',
			'tiki_woo_coupons',
			array(
				'description'    => 'The Discount Type',
				'label_for'      => 'discount_type',
				'options'        => $options,
				'option_name'    => 'tiki_woo_coupons',
				'select_options' => array(
					array(
						'option_name'  => 'Percentage discount',
						'option_value' => 'percent',
					),
					array(
						'option_name'  => 'Fixed cart discount',
						'option_value' => 'fixed_cart',
					),
					array(
						'option_name'  => 'Fixed product discount',
						'option_value' => 'fixed_product',
					),
				),
			)
		);

		add_settings_field(
			'discount_value',
			__( 'Discoun Value', 'tiki_woo' ),
			array( $this, 'render_input_field' ),
			'tiki_woo_coupons',
			'tiki_woo_coupons',
			array(
				'description' => 'discount_value',
				'type'        => 'number',
				'label_for'   => 'discount_value',
				'options'     => $options,
				'option_name' => 'tiki_woo_coupons',
			)
		);

		add_settings_field(
			'description',
			__( 'Description', 'tiki_woo' ),
			array( $this, 'render_input_field' ),
			'tiki_woo_coupons',
			'tiki_woo_coupons',
			array(
				'description' => 'description',
				'label_for'   => 'description',
				'options'     => $options,
				'option_name' => 'tiki_woo_coupons',
			)
		);

		add_settings_field(
			'Coupon Image',
			__( 'offer_reward', 'tiki_woo' ),
			array( $this, 'render_img_upload' ),
			'tiki_woo_coupons',
			'tiki_woo_coupons',
			array(
				'description' => 'Coupon image',
				'label_for'   => 'offer_reward',
				'options'     => $options,
				'option_name' => 'tiki_woo_coupons',
			)
		);

		add_settings_field(
			'offer_bullet1',
			__( 'offer_bullet1', 'tiki_woo' ),
			array( $this, 'render_bullet_filed' ),
			'tiki_woo_coupons',
			'tiki_woo_coupons',
			array(
				'description' => 'offer_bullet1',
				'label_for'   => 'offer_bullet1',
				'options'     => $options,
				'option_name' => 'tiki_woo_coupons',
			)
		);

		add_settings_field(
			'offer_bullet2',
			__( 'offer_bullet2', 'tiki_woo' ),
			array( $this, 'render_bullet_filed' ),
			'tiki_woo_coupons',
			'tiki_woo_coupons',
			array(
				'description' => 'offer_bullet2',
				'label_for'   => 'offer_bullet2',
				'options'     => $options,
				'option_name' => 'tiki_woo_coupons',
			)
		);

		add_settings_field(
			'offer_bullet3',
			__( 'offer_bullet3', 'tiki_woo' ),
			array( $this, 'render_bullet_filed' ),
			'tiki_woo_coupons',
			'tiki_woo_coupons',
			array(
				'description' => 'offer_bullet3',
				'label_for'   => 'offer_bullet3',
				'options'     => $options,
				'option_name' => 'tiki_woo_coupons',
			)
		);

		add_settings_field(
			'offer_bullet3_cb',
			__( 'offer_bullet3_cb', 'tiki_woo' ),
			array( $this, 'render_bullet_filed' ),
			'tiki_woo_coupons',
			'',
		);
	}

	public function init_cookies_options() {
		$options = get_option( 'tiki_woo_cookies', array() );

		register_setting( 'tiki_woo_cookies', 'tiki_woo_cookies' );

		add_settings_section(
			'tiki_woo_cookies',
			__( 'Coupons Settings', 'tiki_woo' ),
			array( $this, 'tiki_woo_coupon_desc' ),
			'tiki_woo_cookies',
		);

		add_settings_field(
			'cookies_integration',
			__( 'Cookies integration', 'tiki_woo' ),
			array( $this, 'render_select_field' ),
			'tiki_woo_cookies',
			'tiki_woo_cookies',
			array(
				'description'    => 'The Cookies Integration',
				'label_for'      => 'cookies_integration',
				'options'        => $options,
				'option_name'    => 'tiki_woo_cookies',
				'select_options' => array(
					array(
						'option_name'  => 'No integration',
						'option_value' => '',
					),
					array(
						'option_name'  => 'CookieYes Integration',
						'option_value' => 'cookie_yes',
					),
					array(
						'option_name'  => 'Manual Integration',
						'option_value' => 'manual',
					),
				),
			)
		);

	}


	public function init_loyalty_options() {
		$options = get_option( 'tiki_woo_loyalty', array() );

		register_setting( 'tiki_woo_loyalty', 'tiki_woo_loyalty' );

		add_settings_section(
			'tiki_woo_loyalty',
			__( 'loyalty Settings', 'tiki_woo' ),
			array( $this, 'tiki_woo_coupon_desc' ),
			'tiki_woo_loyalty',
		);

		add_settings_field(
			'reward_points',
			__( 'Reward points', 'tiki_woo' ),
			array( $this, 'render_input_field' ),
			'tiki_woo_loyalty',
			'tiki_woo_loyalty',
			array(
				'description' => 'discount_value',
				'type'        => 'number',
				'label_for'   => 'discount_value',
				'options'     => $options,
				'option_name' => 'tiki_woo_loyalty',
			)
		);

		add_settings_field(
			'description',
			__( 'Description', 'tiki_woo' ),
			array( $this, 'render_input_field' ),
			'tiki_woo_loyalty',
			'tiki_woo_loyalty',
			array(
				'description' => 'description',
				'label_for'   => 'description',
				'options'     => $options,
				'option_name' => 'tiki_woo_loyalty',
			)
		);

		add_settings_field(
			'Reward Image',
			__( 'offer_reward', 'tiki_woo' ),
			array( $this, 'render_img_upload' ),
			'tiki_woo_loyalty',
			'tiki_woo_loyalty',
			array(
				'description' => 'Reward image',
				'label_for'   => 'offer_reward',
				'options'     => $options,
				'option_name' => 'tiki_woo_loyalty',
			)
		);

		add_settings_field(
			'offer_bullet1',
			__( 'offer_bullet1', 'tiki_woo' ),
			array( $this, 'render_bullet_filed' ),
			'tiki_woo_loyalty',
			'tiki_woo_loyalty',
			array(
				'description' => 'offer_bullet1',
				'label_for'   => 'offer_bullet1',
				'options'     => $options,
				'option_name' => 'tiki_woo_loyalty',
			)
		);

		add_settings_field(
			'offer_bullet2',
			__( 'offer_bullet2', 'tiki_woo' ),
			array( $this, 'render_bullet_filed' ),
			'tiki_woo_loyalty',
			'tiki_woo_loyalty',
			array(
				'description' => 'offer_bullet2',
				'label_for'   => 'offer_bullet2',
				'options'     => $options,
				'option_name' => 'tiki_woo_loyalty',
			)
		);

		add_settings_field(
			'offer_bullet3',
			__( 'offer_bullet3', 'tiki_woo' ),
			array( $this, 'render_bullet_filed' ),
			'tiki_woo_loyalty',
			'tiki_woo_loyalty',
			array(
				'description' => 'offer_bullet3',
				'label_for'   => 'offer_bullet3',
				'options'     => $options,
				'option_name' => 'tiki_woo_loyalty',
			)
		);

		add_settings_field(
			'offer_bullet3_cb',
			__( 'offer_bullet3_cb', 'tiki_woo' ),
			array( $this, 'render_bullet_filed' ),
			'tiki_woo_loyalty',
			'',
		);
	}

	public function init_general_options() {
		$options = get_option( 'tiki_woo_general', array() );
		$this->init_sdk_options( $options );
		$this->init_ui_options( $options );
	}

	public function init_sdk_options( $options ) {

		register_setting( 'tiki_woo_general', 'tiki_woo_general' );

		add_settings_section(
			'tiki_woo_general_sdk',
			__( 'SDK Settings', 'tiki_woo' ),
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
				'label_for'   => 'publishing_id',
				'options'     => $options,
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

	}

	public function init_ui_options( $options ) {
		add_settings_section(
			'tiki_woo_general_ui',
			__( 'UI Settigns', 'tiki_woo' ),
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
				'label_for'   => 'primary_text_color',
				'options'     => $options,
				'option_name' => 'tiki_woo_general',
				'classes'     => array( 'color-picker' ),
			)
		);

		add_settings_field(
			'Secondary text color',
			__( 'Secondary text color', 'tiki_woo' ),
			array( $this, 'render_input_field' ),
			'tiki_woo_general',
			'tiki_woo_general_ui',
			array(
				'classes'     => array( 'color-picker' ),
				'label_for'   => 'secondary_text_color',
				'options'     => $options,
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
				'classes'     => array( 'color-picker' ),
				'label_for'   => 'primary_background_color',
				'options'     => $options,
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
				'classes'     => array( 'color-picker' ),
				'label_for'   => 'secondary_background_color',
				'options'     => $options,
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
				'classes'     => array( 'color-picker' ),
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
				'label_for'   => 'Font Family',
				'options'     => $options,
				'option_name' => 'tiki_woo_general',
			)
		);
	}

	public function tiki_woo_general_sdk_desc( $args ) {
		?>
		<div class="button-primary">TIKI Console</div>
		<?php
	}

	public function tiki_woo_coupon_desc( $args ) {
		?>
		<div>Coupon offer configuration</div>
		<?php
	}

	public function render_input_field( $args ) {
		$label   = $args['label_for'];
		$value   = isset( $args['options'][ $label ] ) ? $args['options'][ $label ] : '';
		$name    = $args['option_name'] . '[' . $label . ']';
		$type    = isset( $args['type'] ) ? $args['type'] : 'text';
		$classes = isset( $args['classes'] ) ? implode( ' ', $args['classes'] ) : 'regular-text';
		?>
		<input 
			id="<?php echo esc_attr( $label ); ?>"
			name="<?php echo esc_attr( $name ); ?>"
			value="<?php echo esc_attr( $value ); ?>"
			type="<?php echo esc_attr( $type ); ?>"
			class="<?php echo esc_attr( $classes ); ?>" >
		<?php
		if ( isset( $args['description'] ) ) {
			?>
			<p class='description' id='label-description'><?php echo esc_html( $args['description'] ); ?></p>
			<?php
		}
	}

	public function render_img_upload( $args ) {
		$label   = $args['label_for'];
		$value   = isset( $args['options'][ $label ] ) ? $args['options'][ $label ] : '';
		$name    = $args['option_name'] . '[' . $label . ']';
		$type    = isset( $args['type'] ) ? $args['type'] : 'text';
		$classes = isset( $args['classes'] ) ? implode( ' ', $args['classes'] ) : 'regular-text';
		$image   = wp_get_attachment_image_url( $value, 'small' );
		if ( $image ) :
			?>
			<a href="#" class="tiki-img-upload">
				<img style="max-width:150px;max-height:150px" src="<?php echo esc_url( $image ); ?>" />
			</a>
			<br />
			<a href="#" class="tiki-img-remove">Remove image</a>
			<input type="hidden" name="<?php echo esc_attr( $name ); ?>" value="<?php echo absint( $value ); ?>">
		<?php else : ?>
			<a href="#" class="button tiki-img-upload">Upload image</a>
			<a href="#" class="tiki-img-remove" style="display:none">Remove image</a>
			<input type="hidden" name="<?php echo esc_attr( $name ); ?>" value="">
			<?php
		endif;
	}

	public function render_select_field( $args ) {
		$label   = $args['label_for'];
		$value   = isset( $args['options'][ $label ] ) ? $args['options'][ $label ] : '';
		$name    = $args['option_name'] . '[' . $label . ']';
		$type    = isset( $args['type'] ) ? $args['type'] : 'text';
		$classes = isset( $args['classes'] ) ? implode( ' ', $args['classes'] ) : 'regular-text';
		?>
		<select
			id="<?php echo esc_attr( $label ); ?>"
			name="<?php echo esc_attr( $name ); ?>"
			type="<?php echo esc_attr( $type ); ?>"
			class="<?php echo esc_attr( $classes ); ?>" >
		<?php
		foreach ( $args['select_options'] as $option ) {
			?>
				<option value="<?php echo esc_attr( $option['option_value'] ); ?>" 
				<?php
				if ( $value === $option['option_value'] ) {
					echo ' selected';
				}
				?>
				><?php echo esc_html( $option['option_name'] ); ?></option>
			<?php
		}
		?>
		<?php
		if ( isset( $args['description'] ) ) {
			?>
			<p class='description' id='$label-description'><?php echo esc_html( $args['description'] ); ?></p>
			<?php
		}
	}

	public function render_bullet_filed( $args ) {
		$label    = $args['label_for'];
		$value    = isset( $args['options'][ $label ] ) ? $args['options'][ $label ] : '';
		$name     = $args['option_name'] . '[' . $label . ']';
		$cb_name  = $args['option_name'] . '[' . $label . '_cb]';
		$cb_value = isset( $args['options'][ $label . '_cb' ] ) ? $args['options'][ $label . '_cb' ] : false;
		?>
		<input 
			id="<?php echo esc_attr( $label ); ?>"
			name="<?php echo esc_attr( $name ); ?>"
			value="<?php echo esc_attr( $value ); ?>"
			type="text" >
		<select 
			id="<?php echo esc_attr( $label ); ?>_cb"
			name="<?php echo esc_attr( $cb_name ); ?>"
		>
			<option value='used' 
			<?php
			if ( 'used' === $cb_value ) {
				?>
				selected
				<?php
			}
			?>
			> Used </option>
			<option value='not_used' 
			<?php
			if ( 'not_used' === $cb_value ) {
				?>
				selected
				<?php
			}
			?>
			> Not Used </option>>
		</select>
		<?php
		if ( isset( $args['description'] ) ) {
			?>
			<p class='description' id='label-description'><?php echo esc_html( $args['description'] ); ?></p>
			<?php
		}
	}

	public function plugin_links( $links ) {
		$url = get_admin_url() . 'admin.php?page=tiki-woo';
		array_unshift( $links, '<a href="' . $url . '">' . __( 'Settings', 'tiki-woo' ) . '</a>' );
		return $links;
	}

}
