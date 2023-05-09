<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://mytiki.com
 * @since             1.0.0
 * @package           Tiki_Woo_Loyalty
 *
 * @wordpress-plugin
 * Plugin Name:       TIKI WooCommerce Loyalty Points
 * Plugin URI:        https://mytiki.com
 * Description:       This is a description of the plugin.
 * Version:           1.0.0
 * Author:            The TIKI Team
 * Author URI:        https://mytiki.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       tiki-woo-loyalty
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
define( 'TIKI_WOO_LOYALTY_VERSION', '1.0.0' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-tiki-woo-loyalty-activator.php
 */
function activate_tiki_woo_loyalty() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-tiki-woo-loyalty-activator.php';
	Tiki_Woo_Loyalty_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-tiki-woo-loyalty-deactivator.php
 */
function deactivate_tiki_woo_loyalty() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-tiki-woo-loyalty-deactivator.php';
	Tiki_Woo_Loyalty_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_tiki_woo_loyalty' );
register_deactivation_hook( __FILE__, 'deactivate_tiki_woo_loyalty' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-tiki-woo-loyalty.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_tiki_woo_loyalty() {

	$plugin = new Tiki_Woo_Loyalty();
	$plugin->run();

}
run_tiki_woo_loyalty();
