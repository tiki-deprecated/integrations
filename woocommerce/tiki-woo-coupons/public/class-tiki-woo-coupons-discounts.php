<?php
/**
 * The discount types for WooCommerce Coupons.
 *
 * @package    Tiki_Woo_Coupons
 * @subpackage Tiki_Woo_Coupons/public
 * @since      1.0.0
 * @author  Ricardo Gonçalves <ricardo@mytiki.com>
 * @license GPL2 https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt
 * @link    https://mytiki.com
 */

/**
 * The enumeration of the WooCommerce Coupons discount types.
 *
 * @package    Tiki_Woo_Coupons
 * @subpackage Tiki_Woo_Coupons/public
 * @author     Ricardo Gonçalves <ricardo@mytiki.com>
 * @license    GPL2 https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt
 * @link       https://mytiki.com
 * @since      1.0.0
 */
class Tiki_Woo_Coupons_Discounts {
	/**
	 * Fixed value discount type, applied to the cart.
	 *
	 * @var string FIXED_CART
	 */
	const FIXED_CART = 'fixed_cart';

	/**
	 * Percentage discount applied to the cart.
	 *
	 * @var string PERCENT
	 */
	const PERCENT = 'percent';

	/**
	 * Fixed value discount applied per product.
	 *
	 * @var string FIXED_PRODUCT
	 */
	const FIXED_PRODUCT = 'fixed_product';
}
