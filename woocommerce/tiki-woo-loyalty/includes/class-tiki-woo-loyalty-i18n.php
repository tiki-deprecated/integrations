<?php

/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @author  Ricardo Gonçalves <ricardo@mytiki.com>
 * @license GPL2 https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt
 * @link    https://mytiki.com
 * @since   1.0.0
 *
 * @package    Tiki_Woo_Loyalty
 * @subpackage Tiki_Woo_Loyalty/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      1.0.0
 * @package    Tiki_Woo_Loyalty
 * @subpackage Tiki_Woo_Loyalty/includes
 * @author     The TIKI Team <ricardo@mytiki.com>
 */
class Tiki_Woo_Loyalty_i18n
{


    /**
     * Load the plugin text domain for translation.
     */
    public function load_plugin_textdomain()
    {

        load_plugin_textdomain(
            'tiki-woo-loyalty',
            false,
            dirname(dirname(plugin_basename(__FILE__))) . '/languages/'
        );

    }



}
