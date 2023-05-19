<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @author  Ricardo Gonçalves <ricardo@mytiki.com>
 * @license GPL2 https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt
 * @link    https://mytiki.com
 * @since   1.0.0
 *
 * @package    Tiki_Woo_Loyalty
 * @subpackage Tiki_Woo_Loyalty/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Tiki_Woo_Loyalty
 * @subpackage Tiki_Woo_Loyalty/public
 * @author     The TIKI Team <ricardo@mytiki.com>
 */
class Tiki_Woo_Loyalty_Public {

	/**
	 * The ID of this plugin.
	 *
	 * @since  1.0.0
	 * @access private
	 * @var    string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since  1.0.0
	 * @access private
	 * @var    string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @param string $plugin_name The name of the plugin.
	 * @param string $version     The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version     = $version;

	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Tiki_Woo_Loyalty_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Tiki_Woo_Loyalty_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/tiki-woo-loyalty-public.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {
		if ( ! wp_script_is( 'tiki-sdk-js' ) ) {
			wp_enqueue_script( 'tiki-sdk-js', 'https://unpkg.com/@mytiki/tiki-sdk-js@1.0.1/dist/index.js');
			if($this->shouldInitializeTikiSdk()){
				wp_add_inline_script( 'tiki-sdk-js', $this->initiliazeTikiSdk());
			}
		}
		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/tiki-woo-coupons-public.js', array( 'jquery' ), $this->version, false );
		wp_add_inline_script( 'cookie-law-info', '
		let cookieYesCookie = document.cookie.match(new RegExp("(^| )cookieyes-consent=([^;]+)"));
		if(cookieYesCookie == undefined){
			let expire = new Date()
			let expireTime = expire.setFullYear(expire.getFullYear() + 1)
			expire.setTime(expireTime)        
			document.cookie = `cookieyes-consent=consentid:,consent:no,action:yes,necessary:yes,functional:no,analytics:no,performance:no,advertisement:no;expires=${expire.toUTCString()};path=/`
		}
		','before');
	}

	private function initiliazeTikiSdk(): string {
		$primaryTextColor = '#1C0000';
		$secondaryTextColor = '#1C000099';
		$primaryBackgroundColor = '#FFFFFF';
		$secondaryBackgroundColor = '#F6F6F6';
		$accentColor = '#00b272';
		$fontFamily = '"Space Grotesk", sans-serif';
		$description = 'Trade your IDFA (kind of like a serial # for your phone) for a discount.';
		$offer_reward = 'https://cdn.mytiki.com/assets/demo-reward.png';
		$offer_bullet1 = "{ text: 'Learn how our ads perform', isUsed: true }";
		$offer_bullet2 = "{ text: 'Reach you on other platforms', isUsed: false }";
		$offer_bullet3 = "{ text: 'Sold to other companies', isUsed: false }";
		$offer_terms = 'terms.md';
		$offer_ptr = 'db2fd320-aed0-498e-af19-0be1d9630c63';
		$offer_tag = "TikiSdk.TitleTag.deviceId()";
		$offer_use = "{ usecases:[TikiSdk.LicenseUsecase.attribution()] }";
		$publishing_id = 'e12f5b7b-6b48-4503-8b39-28e4995b5f88';
		
		$current_user = wp_get_current_user();

		if (! ( $current_user instanceof WP_User ) ) {
			$user_id = $this->defineAnonymousUserId();
		}else{
			$user_id = $this->defineLoggedInUserId($current_user);
		}

		return "TikiSdk.config()
			.theme
			.primaryTextColor('$primaryTextColor')
			.secondaryTextColor('$secondaryTextColor')
			.primaryBackgroundColor('$primaryBackgroundColor')
			.secondaryBackgroundColor('$secondaryBackgroundColor')
			.accentColor('$accentColor')
			.fontFamily('$fontFamily')
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
					tikiGrantPoints()
					tikiCookieYesAcceptCallback()
				})
				.onDecline(() => {
					tikiRemovePoints()
					tikiCookieYesDenyCallback()
				})
				.disableOnDeclineEnding(true)
				.initialize('$publishing_id', '$user_id')
				.then(() => {
					let tiki_user_id = TikiSdk.id()
					let now = new Date()
					let expireTime = now.setFullYear(now.getFullYear() + 1)
					now.setTime(expireTime)
					document.cookie = 'tiki_user_id='+tiki_user_id+';expires='+now.toUTCString()+';path=/'
					TikiSdk.present()
				})";
	}

	private function defineAnonymousUserId(): string
	{
		if(isset($_COOKIE['tiki_user_id'])) {
			return $_COOKIE['tiki_user_id'];
		}
		$user_id = hash('sha256', get_site_url().microtime(true).mt_Rand());
		setcookie('tiki_user_id', $random_id, strtotime('+1 year'), COOKIEPATH, COOKIE_DOMAIN);
		return $user_id;
	}

	private function defineLoggedInUserId(WP_User $user): string
	{
		$user_id = get_user_meta($user->ID, '_tiki_user_id', true);
		if(!$user_id) {
			if(isset($_COOKIE['tiki_user_id'])) {
				$user_id = $_COOKIE['tiki_user_id'];
			}else{
				$user_id = hash('sha256', get_site_url().microtime(true).mt_Rand());
			}
			update_user_meta($user->ID, '_tiki_user_id', $user_id);
		}
		return $user_id;
	}

	private function shouldInitializeTikiSdk(): bool
	{
		return true;
	}

}
