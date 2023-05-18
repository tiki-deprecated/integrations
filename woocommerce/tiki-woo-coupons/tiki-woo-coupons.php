<?php
/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @package Tiki_Woo_Coupons
 * @link    https://mytiki.com
 * @since   1.0.0
 *
 * @wordpress-plugin
 * Plugin Name:       TIKI for WooCommerce Coupons
 * Plugin URI:        https://mytiki.com
 * Description:       Boost your opt-in rates with TIKI for WooCommerce Coupons!
 * Offer coupons in exchange for cookie consent and data licenses to increase
 * conversions.
 * Version:           1.0.0
 * Author:            The TIKI Team
 * Author URI:        https://mytiki.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       tiki-woo-coupons
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'TIKI_WOO_COUPONS_VERSION', '0.0.1' );

define( 'TIKI_JS_SDK_VERSION', '1.0.6' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-tiki-woo-coupons-activator.php
 */
function activate_tiki_woo_coupons() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-tiki-woo-coupons-activator.php';
	Tiki_Woo_Coupons_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-tiki-woo-coupons-deactivator.php
 */
function deactivate_tiki_woo_coupons() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-tiki-woo-coupons-deactivator.php';
	Tiki_Woo_Coupons_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_tiki_woo_coupons' );
register_deactivation_hook( __FILE__, 'deactivate_tiki_woo_coupons' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-tiki-woo-coupons.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_tiki_woo_coupons() {

	$plugin_path = trailingslashit( WP_PLUGIN_DIR ) . 'woocommerce/woocommerce.php';
	if (
		in_array( $plugin_path, wp_get_active_and_valid_plugins(), true )
		|| ( is_multisite() && in_array( $plugin_path, wp_get_active_network_plugins(), true ) )
	) {
		$plugin = new Tiki_Woo_Coupons();
		$plugin->run();
	} else {
		add_action(
			'admin_notices',
			function() {
				?>
				<div class="notice notice-error">
					<p><?php _esc_html_e( 'Error! <b>TIKI WooCommerce Coupons</b> needs <b>WooCommerce</b> to work properly. <br /><a href="' . admin_url( '/plugin-install.php?s=woocommerce&tab=search&type=term' ) . '">Click here to install <b>WooCommerce</b></a>', 'tiki-sdk-js' ); ?></p>
				</div>
				<?php
			}
		);
	}
}
run_tiki_woo_coupons();
