<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://myiki.com
 * @since      1.0.0
 *
 * @package    Tiki_Woo
 * @subpackage Tiki_Woo/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Tiki_Woo
 * @subpackage Tiki_Woo/public
 * @author     TIKI Team <ricardo@mytiki.com>
 */
class Tiki_Woo_Public {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

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
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version     = $version;

	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 */
	public function enqueue_scripts() {
		if ( ! wp_script_is( 'tiki-sdk-js' ) ) {
			wp_enqueue_script( 'tiki-sdk-js', 'https://unpkg.com/@mytiki/tiki-sdk-js@' . TIKI_SDK_VERSION . '/dist/index.js', array( 'wp-api', $this->plugin_name ), TIKI_SDK_VERSION, true );
			if ( $this->should_initialize_tiki_sdk() ) {
				wp_add_inline_script( 'tiki-sdk-js', $this->initialize_tiki_sdk() );
			}
		}
		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/tiki-woo-public.js', array( 'jquery' ), $this->version, false );
		$options = get_option( 'tiki_sdk_options' );
		if ( isset( $options['cookie_yes_integration'] ) && $options['cookie_yes_integration'] ) {
			$this->cookie_yes_js_integration();
		}
	}

	/**
	 * Applies the coupon in cart if the user has a valid one.
	 */
	public function apply_coupon_in_cart() {
		$current_user = wp_get_current_user();
		$tiki_user_id = get_user_meta( $current_user->ID, '_tiki_user_id', true );
		$code         = substr( $tiki_user_id, 0, 10 );
		$coupon       = new WC_Coupon( $code );
		if ( empty( $coupon->id ) || 0 === $current_user->ID || WC()->cart->has_discount( $code ) ) {
			return;
		}
		WC()->cart->apply_coupon( $code );
	}

	private function initialize_tiki_sdk(): string {

		$coupon_options = get_option( 'tiki_woo_coupons', array() );

		$primary_text_color         = isset( $options['primaryTextColor'] ) ? $options['primaryTextColor'] : '#1C0000';
		$secondary_text_color       = isset( $options['secondaryTextColor'] ) ? $options['secondaryTextColor'] : '#1C000099';
		$primary_background_color   = isset( $options['primaryBackgroundColor'] ) ? $options['primaryBackgroundColor'] : '#FFFFFF';
		$secondary_background_color = isset( $options['secondaryBackgroundColor'] ) ? $options['secondaryBackgroundColor'] : '#F6F6F6';
		$accent_color               = isset( $options['accentColor'] ) ? $options['accentColor'] : '#00b272';
		$font_family                = isset( $options['fontFamily'] ) ? $options['fontFamily'] : '"Space Grotesk", sans-serif';
		$description                = isset( $options['description'] ) ? $options['description'] : 'Trade your IDFA (kind of like a serial # for your phone) for a discount.';
		$offer_reward               = isset( $options['offer_reward'] ) ? $options['offer_reward'] : 'https://cdn.mytiki.com/assets/demo-reward.png';
		$offer_bullet1              = isset( $options['offer_bullet1'] ) ? '{ text: "' . $options['offer_bullet1'] . '", isUsed: ' . ( 'used' === $options['offer_bullet1_cb'] ) . ' }' : "{ text: 'Learn how our ads perform', isUsed: true }";
		$offer_bullet2              = isset( $options['offer_bullet2'] ) ? '{ text: "' . $options['offer_bullet2'] . '", isUsed: ' . ( 'used' === $options['offer_bullet2_cb'] ) . ' }'  : "{ text: 'Reach you on other platforms', isUsed: false }";
		$offer_bullet3              = isset( $options['offer_bullet3'] ) ? '{ text: "' . $options['offer_bullet3'] . '", isUsed: ' . ( 'used' === $options['offer_bullet3_cb'] ) . ' }'  : "{ text: 'Sold to other companies', isUsed: false }";
		$offer_terms                = isset( $options['offer_terms'] ) ? $options['offer_terms'] : 'terms.md';
		$offer_ptr                  = isset( $options['offer_ptr'] ) ? $options['offer_ptr'] : get_site_url() . '_TIKI_WOO_COUPON';
		$offer_tag                  = isset( $options['offer_tag'] ) ? $options['offer_tag'] : 'TikiSdk.TitleTag.deviceId()';
		$offer_use                  = isset( $options['offer_use'] ) ? $options['offer_use'] : '{ usecases:[TikiSdk.LicenseUsecase.attribution()] }';
		$publishing_id              = isset( $options['publishing_id'] ) ? $options['publishing_id'] : '';
		$cookie_yes_integration     = isset( $options['cookie_yes_integration'] ) ? $options['cookie_yes_integration'] : false;

		$current_user = wp_get_current_user();
		if ( ! ( $current_user instanceof WP_User ) ) {
			$user_id = $this->define_anonymous_user_id();
		} else {
			$user_id = $this->define_logged_in_user_id( $current_user );
		}

		return "
		TikiSdk.config()
			.theme
				.primaryTextColor('$primary_text_color')
				.secondaryTextColor('$secondary_text_color')
				.primaryBackgroundColor('$primary_background_color')
				.secondaryBackgroundColor('$secondary_background_color')
				.accentColor('$accent_color')
				.fontFamily('$font_family')
				.and()
			.offer
				.description('$description')
				.reward('$offer_reward')
				.bullet($offer_bullet1)
				.bullet($offer_bullet2)
				.bullet($offer_bullet3)
				.terms('$offer_terms')
				.ptr('$offer_ptr')
				.tag($offer_tag)
				.use($offer_use)
				.add()
			.onAccept(() => {
				tikiSetPresentedCookie()
				tikiCreateUserCoupon() 
				" . (
					$cookie_yes_integration ?
					'tikiCookieYesAcceptCallback()
					' : ''
					) . '
			})
			.onDecline(() => {
				tikiSetPresentedCookie()
				tikiRemoveUserCoupon()
				' . (
					$cookie_yes_integration ?
					'tikiCookieYesDenyCallback()
					' : ''
					) . "
			})
			.disableDeclineEnding(true)
			.disableAcceptEnding(true)
			.initialize('$publishing_id', '$user_id')
			.then(() => {
				let tiki_user_id = TikiSdk.id()
				tikiSetUserIdCookie(tiki_user_id)
				let presented = document.cookie.match('tiki_presented')
				debugger
				if( !presented ) {
					TikiSdk.present()
				}
			})";
	}

	public function save_cookie_tiki_id_to_user_meta() {
		if ( isset( $_COOKIE['tiki_user_id'] ) ) {
			$current_user = wp_get_current_user();
			$tiki_user_id = $_COOKIE['tiki_user_id'];
			update_user_meta( $current_user->ID, '_tiki_user_id', $tiki_user_id );
		}
	}

	private function define_anonymous_user_id(): string {
		if ( isset( $_COOKIE['tiki_user_id'] ) ) {
			return $_COOKIE['tiki_user_id'];
		}
		$user_id = hash( 'sha256', get_site_url() . microtime( true ) . wp_Rand() );
		setcookie( 'tiki_user_id', $random_id, strtotime( '+1 year' ), COOKIEPATH, COOKIE_DOMAIN );
		return $user_id;
	}

	private function define_logged_in_user_id( WP_User $user ): string {
		$user_id = get_user_meta( $user->ID, '_tiki_user_id', true );
		if ( ! $user_id ) {
			if ( isset( $_COOKIE['tiki_user_id'] ) ) {
				$user_id = $_COOKIE['tiki_user_id'];
			} else {
				$user_id = hash( 'sha256', get_site_url() . microtime( true ) . wp_Rand() );
			}
			update_user_meta( $user->ID, '_tiki_user_id', $user_id );
		}
		return $user_id;
	}

	private function should_initialize_tiki_sdk(): bool {
		return true;
	}

	private function cookie_yes_js_integration() {
		wp_add_inline_script(
			'cookie-law-info',
			'
            let cookieYesCookie = document.cookie.match(new RegExp("(^| )cookieyes-consent=([^;]+)"));
            if(cookieYesCookie == undefined){
                let expire = new Date()
                let expireTime = expire.setFullYear(expire.getFullYear() + 1)
                expire.setTime(expireTime)        
                document.cookie = `cookieyes-consent=consentid:,consent:no,action:yes,necessary:yes,functional:no,analytics:no,performance:no,advertisement:no;expires=${expire.toUTCString()};path=/`
            }',
			'before'
		);
	}

}
