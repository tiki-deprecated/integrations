<?php

/**
 * Fired when the plugin is uninstalled.
 *
 * @author  Ricardo Gonçalves <ricardo@mytiki.com>
 * @license GPL2 https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt
 * @link    https://mytiki.com
 * @since   1.0.0
 *
 * @package Tiki_Woo_Coupons
 */

// If uninstall not called from WordPress, then exit.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}
