<?php
/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @package    Tiki_Woo_Coupons
 * @subpackage Tiki_Woo_Coupons/includes
 * @license    GPL2 https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt
 * @link       https://mytiki.com
 * @since      1.0.0
 * @author  Ricardo Gonçalves <ricardo@mytiki.com>
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @package    Tiki_Woo_Coupons
 * @subpackage Tiki_Woo_Coupons/includes
 * @license    GPL2 https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt
 * @link       https://mytiki.com
 * @since      1.0.0
 * @author  Ricardo Gonçalves <ricardo@mytiki.com>
 */
class Tiki_Woo_Coupons_I18n {
	/**
	 * Load the plugin text domain for translation.
	 */
	public function load_plugin_textdomain() {
		load_plugin_textdomain(
			'tiki-woo-coupons',
			false,
			dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages/'
		);
	}
}
