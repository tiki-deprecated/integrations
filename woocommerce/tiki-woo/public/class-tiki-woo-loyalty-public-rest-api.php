<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @author  Ricardo Gonçalves <ricardo@mytiki.com>
 * @license GPL2 https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt
 * @link    https://mytiki.com
 * @since   1.0.0
 *
 * @package    Tiki_Woo_Loyalty
 * @subpackage Tiki_Woo_Loyalty/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Tiki_Woo_Loyalty
 * @subpackage Tiki_Woo_Loyalty/public
 * @author     The TIKI Team <ricardo@myiki.com>
 */
class Tiki_Woo_Loyalty_Public_Rest_Api
{

    public function register_rest_routes()
    {
        register_rest_route(
            'tiki/v1/woocommerce', 'loyalty/grant', 
            array(
                'methods'  => 'post',
                'callback' => array(
                    $this,
                    'grant_points'
                )
            )
        );
        register_rest_route(
            'tiki/v1/woocommerce', 'loyalty/remove',
            array(
                'methods'  => 'post',
                'callback' => array(
                    $this,
                    'remove_points'
                )
            )
        );
           
    }

    function grant_points( WP_REST_Request $request )
    {
        $current_user = wp_get_current_user();
        if($current_user->ID === 0) {
            return new WP_REST_Response(array('error' => 'User not logged in.'), 400);
        }
        update_user_meta($current_user->ID, 'tiki_woocommerce_loyalty_points', 100);
        return new WP_REST_Response(array('message' => "points granted"), 200);
    }

    function remove_points()
    {
        $current_user = wp_get_current_user();
        if(!$current_user) {
            return WP_REST_Response(array('error' => 'User not logged in.'), 400);
        }
        update_user_meta($current_user->ID, 'tiki_woocommerce_loyalty_points', 0);
        return  new WP_REST_Response(array('message' => 'points removed'), 200);
    }
}
