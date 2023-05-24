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
		wp_enqueue_editor();
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

	/**
	 * Register the admin menu.
	 *
	 * @since    1.0.0
	 */
	public function admin_menu() {
		add_submenu_page(
			'woocommerce-marketing',
			__( 'TIKI For WooCommerce', 'tiki-woo' ),
			'TIKI',
			'manage_options',
			'tiki-woo',
			array( $this, 'display' ),
		);
	}

	/**
	 * Initialize the plugin settings.
	 *
	 * @since    1.0.0
	 */
	public function settings_init() {
		$this->init_general_options();
		$this->init_coupons_options();
		$this->init_loyalty_options();
		$this->init_cookies_options();
	}

	/**
	 * Display the plugin admin area.
	 *
	 * @since    1.0.0
	 */
	public function display() {
		$active_tab = isset( $_GET['tab'] ) ? $_GET['tab'] : 'general';
		require_once 'partials/tiki-woo-admin-display.php';
	}

	/**
	 * Description of the General SDK sections
	 *
	 * @since    1.0.0
	 */
	//wpcs:ignore
	public function tiki_woo_general_sdk_desc() {
		$options = get_option( 'tiki_woo_general', array() );
		if ( empty( $options['publishing_id'] ) || empty( $options['private_key'] ) || empty( $options['secret'] ) ) {
			echo __( '<p>Get your credentials in the "<a href="https://console.mytiki.com">TIKI Console</a>' ); // WPCS: XSS ok.
		} else {
			?>
			<p>
			<?php
		}
	}

	/**
	 * Helper function to render input field html.
	 *
	 * @since    1.0.0
	 */
	public function render_input_field( $args ) {
		$label   = $args['label_for'];
		$value   = isset( $args['options'][ $label ] ) ? $args['options'][ $label ] : '';
		$name    = $args['option_name'] . '[' . $label . ']';
		$type    = isset( $args['type'] ) ? $args['type'] : 'text';
		$classes = isset( $args['classes'] ) ? implode( ' ', $args['classes'] ) : 'regular-text';
		$step    = isset( $args['step'] ) ? $args['step'] : '';
		?>
		<input 
			id="<?php echo esc_attr( $label ); ?>"
			name="<?php echo esc_attr( $name ); ?>"
			value="<?php echo esc_attr( $value ); ?>"
			type="<?php echo esc_attr( $type ); ?>"
			class="<?php echo esc_attr( $classes ); ?>" 
			<?php
			if ( ! empty( $step ) ) {
				?>
				step="<?php echo esc_attr( $step ); ?>"
				<?php
			}
			?>
			>
		<?php
		if ( isset( $args['description'] ) ) {
			?>
			<p class='description' id='label-description'><?php echo esc_html( $args['description'] ); ?></p>
			<?php
		}
	}

	/**
	 * Helper function to render img upload html.
	 *
	 * @since    1.0.0
	 */
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
			<a href="#" class="tiki-img-remove"><?php echo esc_html__( 'Remove image', 'tiki-woo' ); ?></a> 
			<input type="hidden" name="<?php echo esc_attr( $name ); ?>" value="<?php echo absint( $value ); ?>">
		<?php else : ?>
			<a href="#" class="button tiki-img-upload"><?php echo esc_html__( 'Upload image', 'tiki-woo' ); ?></a>
			<a href="#" class="tiki-img-remove" style="display:none"><?php echo esc_html__( 'Remove image', 'tiki-woo' ); ?></a>
			<input type="hidden" name="<?php echo esc_attr( $name ); ?>" value="">
			<?php
		endif;
	}

		/**
	 * Helper function to render img upload html.
	 *
	 * @since    1.0.0
	 */
	public function render_textarea( $args ) {
		$label   = $args['label_for'];
		$value   = isset( $args['options'][ $label ] ) ? $args['options'][ $label ] : '';
		$name    = $args['option_name'] . '[' . $label . ']';
		$type    = isset( $args['type'] ) ? $args['type'] : 'text';
		$classes = isset( $args['classes'] ) ? implode( ' ', $args['classes'] ) : 'regular-text';
		$step    = isset( $args['step'] ) ? $args['step'] : '';
		?>
		<textarea 
			id="<?php echo esc_attr( $label ); ?>"
			name="<?php echo esc_attr( $name ); ?>"
			type="<?php echo esc_attr( $type ); ?>"
			class="<?php echo esc_attr( $classes ); ?>" 
			cols=50
			rows=10 
			<?php
			if ( ! empty( $step ) ) {
				?>
				step="<?php echo esc_attr( $step ); ?>"
				<?php
			}
			?>
			><?php echo esc_textarea( $value ); ?></textarea>
		<?php
		if ( isset( $args['description'] ) ) {
			?>
			<p class='description' id='label-description'><?php echo esc_html( $args['description'] ); ?></p>
			<?php
		}
	}

	/**
	 * Helper funcion to render select field html.
	 *
	 * @since    1.0.0
	 */
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
		</select>
		<?php
		if ( isset( $args['description'] ) ) {
			?>
			<p class='description' id='$label-description'><?php echo esc_html( $args['description'] ); ?></p>
			<?php
		}
	}

	/**
	 * Helper function to render the fields that defines the bullets.
	 *
	 * @since    1.0.0
	 */
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

	private function init_coupons_options() {
		$options = get_option( 'tiki_woo_coupons', array() );

		register_setting( 'tiki_woo_coupons', 'tiki_woo_coupons' );

		add_settings_section(
			'tiki_woo_coupons_enable',
			__( 'Enable Discount Coupons', 'tiki-woo' ),
			null,
			'tiki_woo_coupons',
		);

		add_settings_field(
			'enable_coupons',
			__( 'Enable Discount Coupons', 'tiki-woo' ),
			array( $this, 'render_select_field' ),
			'tiki_woo_coupons',
			'tiki_woo_coupons_enable',
			array(
				'label_for'      => 'enable_coupons',
				'options'        => $options,
				'option_name'    => 'tiki_woo_coupons',
				'select_options' => array(
					array(
						'option_name'  => __( 'Enable' ),
						'option_value' => 1,
					),
					array(
						'option_name'  => __( 'Disable' ),
						'option_value' => 0,
					),
				),
			)
		);

		add_settings_section(
			'tiki_woo_coupons',
			__( 'Coupons Settings', 'tiki-woo' ),
			null,
			'tiki_woo_coupons',
		);

		add_settings_field(
			'discount_type',
			__( 'Discount Type', 'tiki-woo' ),
			array( $this, 'render_select_field' ),
			'tiki_woo_coupons',
			'tiki_woo_coupons',
			array(
				'label_for'      => 'discount_type',
				'options'        => $options,
				'option_name'    => 'tiki_woo_coupons',
				'select_options' => array(
					array(
						'option_name'  => __( 'Percentage discount' ),
						'option_value' => 'percent',
					),
					array(
						'option_name'  => __( 'Fixed cart discount' ),
						'option_value' => 'fixed_cart',
					),
					array(
						'option_name'  => __( 'Fixed product discount' ),
						'option_value' => 'fixed_product',
					),
				),
			)
		);

		add_settings_field(
			'discount_value',
			__( 'Discount Value', 'tiki-woo' ),
			array( $this, 'render_input_field' ),
			'tiki_woo_coupons',
			'tiki_woo_coupons',
			array(
				'type'        => 'number',
				'step'        => '0.01',
				'label_for'   => 'discount_value',
				'options'     => $options,
				'option_name' => 'tiki_woo_coupons',
			)
		);

		add_settings_field(
			'description',
			__( 'Description', 'tiki-woo' ),
			array( $this, 'render_input_field' ),
			'tiki_woo_coupons',
			'tiki_woo_coupons',
			array(

				'label_for'   => 'description',
				'options'     => $options,
				'option_name' => 'tiki_woo_coupons',
			)
		);

		add_settings_field(
			'offer_reward',
			__( 'Offer image', 'tiki-woo' ),
			array( $this, 'render_img_upload' ),
			'tiki_woo_coupons',
			'tiki_woo_coupons',
			array(

				'label_for'   => 'offer_reward',
				'options'     => $options,
				'option_name' => 'tiki_woo_coupons',
			)
		);

		add_settings_field(
			'offer_bullet1',
			__( 'Offer use case 1', 'tiki-woo' ),
			array( $this, 'render_bullet_filed' ),
			'tiki_woo_coupons',
			'tiki_woo_coupons',
			array(
				'label_for'   => 'offer_bullet1',
				'options'     => $options,
				'option_name' => 'tiki_woo_coupons',
			)
		);

		add_settings_field(
			'offer_bullet2',
			__( 'Offer use case 2', 'tiki-woo' ),
			array( $this, 'render_bullet_filed' ),
			'tiki_woo_coupons',
			'tiki_woo_coupons',
			array(

				'label_for'   => 'offer_bullet2',
				'options'     => $options,
				'option_name' => 'tiki_woo_coupons',
			)
		);

		add_settings_field(
			'offer_bullet3',
			__( 'Offer use case 3', 'tiki-woo' ),
			array( $this, 'render_bullet_filed' ),
			'tiki_woo_coupons',
			'tiki_woo_coupons',
			array(

				'label_for'   => 'offer_bullet3',
				'options'     => $options,
				'option_name' => 'tiki_woo_coupons',
			)
		);

		add_settings_field(
			'offer_terms',
			__( 'Offer terms', 'tiki-woo' ),
			array( $this, 'render_textarea' ),
			'tiki_woo_coupons',
			'tiki_woo_coupons',
			array(
				'label_for'   => 'offer_terms',
				'options'     => $options,
				'option_name' => 'tiki_woo_coupons',
			)
		);
	}

	private function init_cookies_options() {
		$options = get_option( 'tiki_woo_cookies', array() );

		register_setting( 'tiki_woo_cookies', 'tiki_woo_cookies' );

		add_settings_section(
			'tiki_woo_cookies',
			__( 'Coupons Settings', 'tiki-woo' ),
			null,
			'tiki_woo_cookies',
		);

		add_settings_field(
			'cookies_integration',
			__( 'Cookies integration', 'tiki-woo' ),
			array( $this, 'render_select_field' ),
			'tiki_woo_cookies',
			'tiki_woo_cookies',
			array(
				'description'    => __( 'The Cookies Integration' ),
				'label_for'      => 'cookies_integration',
				'options'        => $options,
				'option_name'    => 'tiki_woo_cookies',
				'select_options' => array(
					array(
						'option_name'  => __( 'No integration' ),
						'option_value' => '',
					),
					array(
						'option_name'  => __( 'Cookie Yes Integration' ),
						'option_value' => 'cookie_yes',
					),
				),
			)
		);

	}

	private function init_loyalty_options() {
		$options = get_option( 'tiki_woo_loyalty', array() );

		register_setting( 'tiki_woo_loyalty', 'tiki_woo_loyalty' );

		add_settings_section(
			'tiki_woo_loyalty_enable',
			__( 'Enable Loyalty Points', 'tiki-woo' ),
			null,
			'tiki_woo_loyalty',
		);

		add_settings_field(
			'enable_coupons',
			__( 'Enable Loyalty Points', 'tiki-woo' ),
			array( $this, 'render_select_field' ),
			'tiki_woo_loyalty',
			'tiki_woo_loyalty_enable',
			array(
				'description'    => __( 'Enable loyalty points in exchange for cookies consent' ),
				'label_for'      => 'enable_points',
				'options'        => $options,
				'option_name'    => 'tiki_woo_loyalty',
				'select_options' => array(
					array(
						'option_name'  => __( 'Enable' ),
						'option_value' => 1,
					),
					array(
						'option_name'  => __( 'Disable' ),
						'option_value' => 0,
					),
				),
			)
		);

		add_settings_section(
			'tiki_woo_loyalty',
			__( 'loyalty Settings', 'tiki-woo' ),
			null,
			'tiki_woo_loyalty',
		);

		add_settings_field(
			'reward_points',
			__( 'Reward points', 'tiki-woo' ),
			array( $this, 'render_input_field' ),
			'tiki_woo_loyalty',
			'tiki_woo_loyalty',
			array(

				'type'        => 'number',
				'label_for'   => 'reward_points',
				'options'     => $options,
				'option_name' => 'tiki_woo_loyalty',
			)
		);

		add_settings_field(
			'description',
			__( 'Description', 'tiki-woo' ),
			array( $this, 'render_input_field' ),
			'tiki_woo_loyalty',
			'tiki_woo_loyalty',
			array(

				'label_for'   => 'description',
				'options'     => $options,
				'option_name' => 'tiki_woo_loyalty',
			)
		);

		add_settings_field(
			'offer_reward',
			__( 'Offer Image', 'tiki-woo' ),
			array( $this, 'render_img_upload' ),
			'tiki_woo_loyalty',
			'tiki_woo_loyalty',
			array(

				'label_for'   => 'offer_reward',
				'options'     => $options,
				'option_name' => 'tiki_woo_loyalty',
			)
		);

		add_settings_field(
			'offer_bullet1',
			__( 'Offer use case 1', 'tiki-woo' ),
			array( $this, 'render_bullet_filed' ),
			'tiki_woo_loyalty',
			'tiki_woo_loyalty',
			array(

				'label_for'   => 'offer_bullet1',
				'options'     => $options,
				'option_name' => 'tiki_woo_loyalty',
			)
		);

		add_settings_field(
			'offer_bullet2',
			__( 'Offer use case 2', 'tiki-woo' ),
			array( $this, 'render_bullet_filed' ),
			'tiki_woo_loyalty',
			'tiki_woo_loyalty',
			array(

				'label_for'   => 'offer_bullet2',
				'options'     => $options,
				'option_name' => 'tiki_woo_loyalty',
			)
		);

		add_settings_field(
			'offer_bullet3',
			__( 'Offer use case 3', 'tiki-woo' ),
			array( $this, 'render_bullet_filed' ),
			'tiki_woo_loyalty',
			'tiki_woo_loyalty',
			array(

				'label_for'   => 'offer_bullet3',
				'options'     => $options,
				'option_name' => 'tiki_woo_loyalty',
			)
		);

		add_settings_field(
			'offer_terms',
			__( 'Offer terms', 'tiki-woo' ),
			array( $this, 'render_textarea' ),
			'tiki_woo_loyalty',
			'tiki_woo_loyalty',
			array(
				'description' => __( 'Accepts html and markdown' ),
				'label_for'   => 'offer_terms',
				'options'     => $options,
				'option_name' => 'tiki_woo_coupons',
			)
		);
	}

	private function init_general_options() {
		$options = get_option( 'tiki_woo_general', array() );
		$this->init_sdk_options( $options );
		$this->init_ui_options( $options );
	}

	private function init_sdk_options( $options ) {

		register_setting( 'tiki_woo_general', 'tiki_woo_general' );

		add_settings_section(
			'tiki_woo_general_sdk',
			__( 'Settings', 'tiki-woo' ),
			array( $this, 'tiki_woo_general_sdk_desc' ),
			'tiki_woo_general',
		);

		add_settings_field(
			'publishing_id',
			__( 'Publishing ID', 'tiki-woo' ),
			array( $this, 'render_input_field' ),
			'tiki_woo_general',
			'tiki_woo_general_sdk',
			array(
				'label_for'   => 'publishing_id',
				'options'     => $options,
				'option_name' => 'tiki_woo_general',
			)
		);

		add_settings_field(
			'private_key',
			__( 'Private Key ID', 'tiki-woo' ),
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
			__( 'Secret', 'tiki-woo' ),
			array( $this, 'render_input_field' ),
			'tiki_woo_general',
			'tiki_woo_general_sdk',
			array(
				'label_for'   => 'secret',
				'options'     => $options,
				'type'        => 'password',
				'option_name' => 'tiki_woo_general',
			)
		);

		add_settings_field(
			'delete_settings',
			__( 'Remove Settings' ),
			array( $this, 'render_checkbox' ),
			'tiki_woo_general',
			'tiki_woo_general_sdk',
			array(
				'description' => 'Remove all plugin settings on uninstall',
				'label_for'   => 'delete_settings',
				'options'     => $options,
				'option_name' => 'tiki_woo_general',
			)
		);
	}

	public function render_checkbox( $args ) {
		$label   = $args['label_for'];
		$value   = isset( $args['options'][ $label ] ) ? $args['options'][ $label ] : 0;
		$name    = $args['option_name'] . '[' . $label . ']';
		$classes = isset( $args['classes'] ) ? implode( ' ', $args['classes'] ) : '';
		$checked = 1 === absint( $value ) ? 'checked' : '';
		?>
		<input
			type="checkbox"	
			id="<?php echo esc_attr( $label ); ?>"
			name="<?php echo esc_attr( $name ); ?>"
			value="1"
			class="<?php echo esc_attr( $classes ); ?>" 
			<?php echo esc_attr( $checked ); ?> />
		<?php
		if ( isset( $args['description'] ) ) {
			?>
			<span class='description' id='label-description'><?php echo esc_html( $args['description'] ); ?></span>
			<?php
		}
	}

	private function init_ui_options( $options ) {
		add_settings_section(
			'tiki_woo_general_ui',
			__( 'UI Settings', 'tiki-woo' ),
			null,
			'tiki_woo_general',
		);

		add_settings_field(
			'default_offer',
			__( 'Default Offer', 'tiki-woo' ),
			array( $this, 'render_select_field' ),
			'tiki_woo_general',
			'tiki_woo_general_ui',
			array(
				'description'    => __( 'Sets the default offer for Cookies consent. If the default option is disabled, the other will be used instead.' ),
				'label_for'      => 'default_offer',
				'options'        => $options,
				'option_name'    => 'tiki_woo_general',
				'select_options' => array(
					array(
						'option_name'  => __( 'Coupons' ),
						'option_value' => 'coupons',
					),
					array(
						'option_name'  => __( 'Loyaly points' ),
						'option_value' => 'points',
					),
				),
			)
		);

		add_settings_field(
			'Primary text color',
			__( 'Primary text color', 'tiki-woo' ),
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
			__( 'Secondary text color', 'tiki-woo' ),
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
			__( 'Primary background color', 'tiki-woo' ),
			array( $this, 'render_input_field' ),
			'tiki_woo_general',
			'tiki_woo_general_ui',
			array(
				'classes'     => array( 'color-picker' ),
				'label_for'   => 'primary_background_color',
				'options'     => $options,
				'option_name' => 'tiki_woo_general',
			)
		);

		add_settings_field(
			'Secondary background color',
			__( 'Secondary background color', 'tiki-woo' ),
			array( $this, 'render_input_field' ),
			'tiki_woo_general',
			'tiki_woo_general_ui',
			array(
				'classes'     => array( 'color-picker' ),
				'label_for'   => 'secondary_background_color',
				'options'     => $options,
				'option_name' => 'tiki_woo_general',
			)
		);

		add_settings_field(
			'Accent color',
			__( 'Accent color', 'tiki-woo' ),
			array( $this, 'render_input_field' ),
			'tiki_woo_general',
			'tiki_woo_general_ui',
			array(
				'classes'     => array( 'color-picker' ),
				'label_for' => 'accent_color',
				'options'   => $options,
				'option_name' => 'tiki_woo_general',
			)
		);

		add_settings_field(
			'Font Family',
			__( 'Font Family', 'tiki-woo' ),
			array( $this, 'render_input_field' ),
			'tiki_woo_general',
			'tiki_woo_general_ui',
			array(

				'label_for'   => 'font_family',
				'options'     => $options,
				'option_name' => 'tiki_woo_general',
			)
		);
	}

	public function plugin_links( $links ) {
		$url = get_admin_url() . 'admin.php?page=tiki-woo';
		array_unshift( $links, '<a href="' . $url . '">' . __( 'Settings', 'tiki-woo' ) . '</a>' );
		return $links;
	}

	private function tiki_authentication() {
		$url     = 'https://mytiki.com/api/authorize';
		$headers = array(
			'Content-Type' => 'application/x-www-form-urlencoded',
			'accept'       => 'application/json',
		);
		$body    = array(
			'grant_type' => 'client_credentials',
			'scope'      => 'index',
		);

		$response = wp_remote_post(
			$url,
			array(
				'headers' => $headers,
				'body'    => $body,
			)
		);

		if ( is_wp_error( $response ) ) {
			$error_message = $response->get_error_message();
			return 'HTTP Error: ' . $error_message;
		} else {
			$response_body = wp_remote_retrieve_body( $response );
			return $response_body;
		}
	}

}
