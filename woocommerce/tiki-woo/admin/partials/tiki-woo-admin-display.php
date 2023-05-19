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
?>

<div class="wrap">
	<div id="icon-themes" class="icon32"></div>  
	<h2>TIKI For WooCommerce</h2>
	<?php settings_errors(); ?>  
	<form method="POST" action="options.php">  
		<?php
			settings_fields( 'tiki_woo_general' );
			do_settings_sections( 'tiki_woo_general' );
		?>
		<?php submit_button(); ?>  
	</form> 
</div>
