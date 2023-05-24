<?php // exit if uninstall constant is not defined
if ( ! defined( 'WP_UNINSTALL_PLUGIN ' ) ) {
	exit;
}

$general_options = get_option( 'tiki_woo_general', array() );
if ( 1 === $options['delete_settings'] ) {
	delete_option( 'tiki_woo_general' );
	delete_option( 'tiki_woo_coupons' );
	delete_option( 'tiki_woo_loyalty' );
	delete_option( 'tiki_woo_cookies' );
}
