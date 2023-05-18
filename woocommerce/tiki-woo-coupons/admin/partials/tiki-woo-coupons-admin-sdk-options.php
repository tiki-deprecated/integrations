<?php
/**
 * Provide an admin area view for the plugin
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * PHP version 7
 *
 * @category   View
 * @package    Tiki_Woo_Coupons
 * @subpackage Tiki_Woo_Coupons/admin/partials
 * @author     Ricardo Gonçalves <ricardo@mytiki.com>
 * @license    GPL2 https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt
 * @link       https://mytiki.com
 * @since      1.0.0
 */

$defaults = array(
	'primaryTextColor'         => '#1C0000',
	'secondaryTextColor'       => '#1C000099',
	'primaryBackgroundColor'   => '#FFFFFF',
	'secondaryBackgroundColor' => '#F6F6F6',
	'accentColor'              => '#00b272',
	'fontFamily'               => 'Space Grotesk',
);

$options = wp_parse_args( get_option( 'tiki_woo_coupons_options' ), $defaults );
?>

<div class="wrap">
	<div id="icon-themes" class="icon32"></div>  
	<h2>TIKI</h2>
	<form method="POST" action="options.php">  
		<h3>TIKI SDK</h3>
			<table class="form-table" role="presentation">
				<tbody>
					<tr>
						<th scope="row"><label for="tiki_publishing_id">Publishing ID</label></th>
						<td><input name="tiki_publishing_id" type="text" id="publishing_id" value="e12f5b7b-6b48-4503-8b39-28e4995b5f88" class="regular-text" />
						<p class="description" id="tiki_publishing_id-description">The Publishing ID from TIKI Console</p>
						</td>
					</tr>

					<tr>
						<th scope="row"><label for="tiki_app_secret">App Secret</label></th>
						<td>
							<input name="tiki_app_secret" type="password" id="tiki_app_secret" value="e12f5b7b-6b48-4503-8b39-28e4995b5f88" class="regular-text" />
							<p class="description" id="tiki_app_secret-description">The App Secret from TIKI Console</p>
						</td>
					</tr>
				</tbody>
			</table>
		<h3>UI Customization</h3>
		<table class="form-table" role="presentation">
				<tbody>
					<tr>
						<th scope="row"><label for="primaryTextColor">Primary text color</label></th>
						<td><input class="color-picker" name="primaryTextColor" type="text" id="primaryTextColor" value="<?php echo $options['primaryTextColor']; ?>" class="regular-text" />
						</td>
					</tr>
					<tr>
						<th scope="row"><label for="secondaryTextColor">Secondary text color</label></th>
						<td><input class="color-picker" name="secondaryTextColor" type="text" id="secondaryTextColor" value="<?php echo $options['secondaryTextColor']; ?>" class="regular-text" />
						</td>
					</tr>
					<tr>
						<th scope="row"><label for="primaryBackgroundColor">Primary background color</label></th>
						<td><input class="color-picker" name="primaryBackgroundColor" type="text" id="primaryBackgroundColor" value="<?php echo $options['primaryBackgroundColor']; ?>" class="regular-text" />
						</td>
					</tr>
					<tr>
						<th scope="row"><label for="secondaryBackgroundColor">Secondary background color</label></th>
						<td><input class="color-picker" name="secondaryBackgroundColor" type="text" id="secondaryBackgroundColor" value="<?php echo $options['secondaryBackgroundColor']; ?>" class="regular-text" />
						</td>
					</tr>
					<tr>
						<th scope="row"><label for="accentColor">Accent color</label></th>
						<td><input class="color-picker" name="accentColor" type="text" id="accentColor" value="<?php echo $options['accentColor']; ?>" class="regular-text" />
						</td>
					</tr>
					<tr>
						<th scope="row"><label for="fontFamily">Font Family</label></th>
						<td><input name="fontFamily" type="text" id="fontFamily" value="<?php echo $options['fontFamily']; ?>" class="regular-text" />
						</td>
					</tr>
				</tbody>
			</table>
		<?php submit_button(); ?>  
	</form> 
</div>
</div>






