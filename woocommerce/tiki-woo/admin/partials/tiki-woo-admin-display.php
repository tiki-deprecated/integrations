<?php

/**
 * Provide a admin area view for the plugin
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @link       https://myiki.com
 * @since      1.0.0
 *
 * @package    Tiki_Woo
 * @subpackage Tiki_Woo/admin/partials
 */

$active_tab = $_GET['tab'];
?>

<div class="wrap">
	<div id="icon-themes" class="icon32"></div>  
	<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
	<nav class="nav-tab-wrapper">
		<a href="?page=tiki-woo" class="nav-tab <?php if ( null === $active_tab ) : ?>
			nav-tab-active<?php endif; ?>">General</a>
		<a href="?page=tiki-woo&tab=coupons" class="nav-tab <?php if ( 'coupons' === $active_tab ) : ?>
			nav-tab-active<?php endif; ?>">Coupons</a>
		<a href="?page=tiki-woo&tab=loyalty" class="nav-tab <?php if ( 'loyalty' === $active_tab ) : ?>
			nav-tab-active<?php endif; ?>">Loyalty</a>
		<a href="?page=tiki-woo&tab=cookies" class="nav-tab <?php if ( 'cookies' === $active_tab ) : ?>
			nav-tab-active<?php endif; ?>">Cookies</a>
	</nav>

	<form method="POST" action="options.php"> 
		<?php
		switch ( $active_tab ) :
			case 'coupons':
				settings_fields( 'tiki_woo_coupons' );
				do_settings_sections( 'tiki_woo_coupons' );
				break;
			case 'loyalty':
				settings_fields( 'tiki_woo_loyalty' );
				do_settings_sections( 'tiki_woo_loyalty' );
				break;
			case 'cookies':
				settings_fields( 'tiki_woo_cookies' );
				do_settings_sections( 'tiki_woo_cookies' );
				break;
			default:
				settings_fields( 'tiki_woo_general' );
				do_settings_sections( 'tiki_woo_general' );
				break;
		endswitch;
		?>
		<?php submit_button(); ?>  
	</form> 
</div>
