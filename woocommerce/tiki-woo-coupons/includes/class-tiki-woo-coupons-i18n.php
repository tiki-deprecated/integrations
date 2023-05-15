<?php

/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       https://mytiki.com
 * @since      1.0.0
 *
 * @package    Tiki_Woo_Coupons
 * @subpackage Tiki_Woo_Coupons/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      1.0.0
 * @package    Tiki_Woo_Coupons
 * @subpackage Tiki_Woo_Coupons/includes
 * @author     The TIKI Team <ricardo@myiki.com>
 */
class Tiki_Woo_Coupons_i18n {


	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.0
	 */
	public function load_plugin_textdomain() {

		load_plugin_textdomain(
			'tiki-woo-coupons',
			false,
			dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages/'
		);

	}



}
