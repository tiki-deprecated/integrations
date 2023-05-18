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
	'discount_type'  => 'percent',
	'discount_value' => 10,
 	'description'    => 'Trade your IDFA (kind of like a serial # for your phone) for a discount.',
	'offer_reward'   => 'https://cdn.mytiki.com/assets/demo-reward.png',
	'offer_bullet1'  => '{ "text": "Learn how our ads perform", "isUsed": true }',
	'offer_bullet2'  => '{ "text": "Reach you on other platforms", "isUsed": false }',
	'offer_bullet3'  => '{ "text": "Sold to other companies", "isUsed": false }',
);

$options = wp_parse_args( get_option( 'tiki_woo_coupons_options' ), $defaults );
?>

<div class="wrap">
	<div id="icon-themes" class="icon32"></div>  
	<h2>TIKI WooCommerce Coupons</h2>
	<form method="POST" action="options.php">  
		<h3>Coupon Options</h3>
		<table class="form-table" role="presentation">
				<tbody>
					<tr>
						<th scope="row"><label for="dicount_type">Discount Type</label></th>
						<td>
							<select name="dicount_type" id="dicount_type" class="regular-text">
								<option value="fixed_cart"
								<?php
								if ( "fixed_cart" === $options['discount_type'] ) {
									echo 'selected';
								}
								?>
								>Fixed value in cart</option>
								<option value="fixed_product"
								<?php
								if ( "fixed_product" === $options['discount_type'] ) {
									echo 'selected';
								}
								?>
								>Fixed value in product</option>
								<option value="percent"
								<?php
								if ( "percent" === $options['discount_type'] ) {
									echo 'percent';
								}
								?>
								>Percentage of the order</option>	
							</select>
						</td>
					</tr>
					<tr>
						<th scope="row"><label for="discount_value">Discount Value</label></th>
						<td><input name="discount_value" type="number" id="discount_value" value="<?php echo $options['discount_value']; ?>" class="regular-text" />
						</td>
					</tr>
					<tr>
						<th scope="row"><label for="description">Description</label></th>
						<td><input name="description" type="text" id="description" value="<?php echo $options['description']; ?>" class="regular-text" />
						</td>
					</tr>
					<tr>
						<th scope="row"><label for="offer_reward">Offer Reward</label></th>
						<td><input name="offer_reward" type="text" id="offer_reward" value="<?php echo $options['offer_reward']; ?>" class="regular-text" />
						</td>
					</tr>
					<tr>
						<th scope="row"><label for="offer_bullet1">Use case 1</label></th>
						<td><input name="offer_bullet1" type="text" id="offer_bullet1" value="<?php echo json_decode( $options['offer_bullet1'], true )['text']; ?>" class="regular-text" />
						<input name="offer_bullet1_is_used" type="checkbox" id="offer_bullet1_is_used" <?php if (json_decode( $options['offer_bullet1'], true )['isUsed']) echo 'checked="checked"'; ?>"/> is Used ?
						</td>
					</tr>
					<tr>
						<th scope="row"><label for="offer_bullet2">Use case 2</label></th>
						<td><input name="offer_bullet2" type="text" id="offer_bullet2" value="<?php echo json_decode( $options['offer_bullet2'], true )['text']; ?>" class="regular-text" />
						<input name="offer_bullet3_is_used" type="checkbox" id="offer_bullet2_is_used" <?php if (json_decode( $options['offer_bullet2'], true )['isUsed']) echo 'checked="checked"'; ?>"/> is Used ?
						</td>
					</tr>
					<tr>
						<th scope="row"><label for="offer_bullet3_text">Use case 3</label></th>
						<td><input name="offer_bullet3_text" type="text" id="offer_bullet3" value="<?php echo json_decode( $options['offer_bullet3'], true )['text']; ?>" class="regular-text" />
						<input name="offer_bullet3_is_used" type="checkbox" id="offer_bullet3_is_used" <?php if (json_decode( $options['offer_bullet3'], true )['isUsed']) echo 'checked="checked"'; ?>"/> is Used ?
						</td>
					</tr>
				</tbody>
			</table>
		<?php submit_button(); ?>  
	</form> 
</div>
</div>






