<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @author  Ricardo Gonçalves <ricardo@mytiki.com>
 * @license GPL2 https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt
 * @link    https://mytiki.com
 * @since   1.0.0
 *
 * @package    Tiki_Woo_Loyalty
 * @subpackage Tiki_Woo_Loyalty/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Tiki_Woo_Loyalty
 * @subpackage Tiki_Woo_Loyalty/admin
 * @author     The TIKI Team <ricardo@mytiki.com>
 */
class Tiki_Woo_Loyalty_Admin
{

    /**
     * The ID of this plugin.
     *
     * @since  1.0.0
     * @access private
     * @var    string    $plugin_name    The ID of this plugin.
     */
    private $plugin_name;

    /**
     * The version of this plugin.
     *
     * @since  1.0.0
     * @access private
     * @var    string    $version    The current version of this plugin.
     */
    private $version;

    /**
     * Initialize the class and set its properties.
     *
     * @param string $plugin_name The name of this plugin.
     * @param string $version     The version of this plugin.
     */
    public function __construct( $plugin_name, $version )
    {

        $this->plugin_name = $plugin_name;
        $this->version = $version;

    }

    /**
     * Register the stylesheets for the admin area.
     */
    public function enqueue_styles()
    {

        /**
         * This function is provided for demonstration purposes only.
         *
         * An instance of this class should be passed to the run() function
         * defined in Tiki_Woo_Loyalty_Loader as all of the hooks are defined
         * in that particular class.
         *
         * The Tiki_Woo_Loyalty_Loader will then create the relationship
         * between the defined hooks and the functions defined in this
         * class.
         */

        wp_enqueue_style($this->plugin_name, plugin_dir_url(__FILE__) . 'css/tiki-woo-loyalty-admin.css', array(), $this->version, 'all');

    }

    /**
     * Register the JavaScript for the admin area.
     */
    public function enqueue_scripts()
    {

        /**
         * This function is provided for demonstration purposes only.
         *
         * An instance of this class should be passed to the run() function
         * defined in Tiki_Woo_Loyalty_Loader as all of the hooks are defined
         * in that particular class.
         *
         * The Tiki_Woo_Loyalty_Loader will then create the relationship
         * between the defined hooks and the functions defined in this
         * class.
         */

        wp_enqueue_script($this->plugin_name, plugin_dir_url(__FILE__) . 'js/tiki-woo-loyalty-admin.js', array( 'jquery' ), $this->version, false);

    }

    function admin_menu()
    {
        if (empty($GLOBALS['admin_page_hooks']['tiki_woocommerce_menu']) ) {
            add_menu_page(
                'TIKI',
                'TIKI',
                'manage_options',
                'tiki_woocommerce_menu',
                [$this, 'admin_menu_page'],
                $this->get_icon()
            );
        }
        add_submenu_page(
            'tiki_woocommerce_menu',
            'TIKI Woocommerce Loyalty',
            'TIKI Woocommerce Loyalty',
            'manage_options',
            'tiki_woo_loyalty',
            [$this, 'admin_menu_page']
        );
    } 

    function admin_menu_page()
    {
        // check user capabilities
        if (! current_user_can('manage_options') ) {
            return;
        }
        
        //Get the active tab from the $_GET param
        $default_tab = null;
        $tab = isset($_GET['tab']) ? $_GET['tab'] : $default_tab;
        
        ?>
          <!-- Our admin page content should all be inside .wrap -->
          <div class="wrap">
            <!-- Print the page title -->
            <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
            <!-- Here are our tabs -->
            <nav class="nav-tab-wrapper">
              <a href="?page=tiki_woocommerce_menu" class="nav-tab <?php if($tab===null) :?>nav-tab-active<?php 
             endif; ?>">TIKI SDK</a>
              <a href="?page=tiki_woocommerce_menu&tab=coupon" class="nav-tab <?php if($tab==='coupon') :?>nav-tab-active<?php 
             endif; ?>">Coupons</a>
              <a href="?page=tiki_woocommerce_menu&tab=loyalty" class="nav-tab <?php if($tab==='loyalty') :?>nav-tab-active<?php 
             endif; ?>">Loyalty</a>
            </nav>
        
            <div class="tab-content">
        <?php switch($tab) :
        case 'settings':
                 
            break;
        case 'tools':
            echo 'Tools';
            break;
        default:
            echo 'Default tab';
            break;
        endswitch; ?>
            </div>
          </div>
        <?php
    }

    private function get_icon()
    {
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzE4IiBoZWlnaHQ9IjUzMyIgdmlld0JveD0iMCAwIDMxOCA1MzMiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik02Mi45MjYyIDUwLjg0MzFDODguMTMzNSA1MS4xOTk5IDEyNi41OSA1OS4zMDY0IDE0OC44MjEgMTAwLjk2MkMxNjQuMjU1IDQxLjAzNTQgMTc5LjU0OCAxNS42MjEzIDE4OC42OTMgNS4wNzY4QzE5Mi41MDEgMC42NjU3MTcgMTk5LjcwMSAxLjM2MTM1IDIwMi41NTEgNi40NzAxQzIxOS4xMzYgMzYuMjIxMSAyMjAuODA4IDcyLjQ3MjggMjE4LjE0OSAxMDEuOTM1QzI0OC4xNTMgNzIuNzYxMyAyODQuMTE0IDczLjc0IDMwNy4yMDEgNzguNzQyNEMzMTUuOTcxIDgwLjYzNjcgMzE3LjgyMSA5Mi4xNjM2IDMxMC4wNjkgOTYuNjE5N0MyNTQuNTA3IDEyOC41NCAyMzcuODY0IDE3OS4xOTUgMjM3Ljg2NCAxNzkuMTk1TDEwNy44MDMgMTY0LjMyN0MxMDcuODAzIDE2NC4zMjcgMTAyLjk5NSAxMTEuMTkyIDU2LjA5MyA2Ny41ODI1QzQ5LjUzNTQgNjEuNTU0MiA1My45NTE2IDUwLjcyNjQgNjIuOTI2MiA1MC44NDMxWiIgZmlsbD0iIzAwMDA3MiIvPgo8cGF0aCBkPSJNMjM4LjQ1NSAxODAuMTMzTDIzNy43OTIgMTgwLjA0NUwxMDcuMDY5IDE2NS4wODlMMTA3LjAwNiAxNjQuNDI2QzEwNi45NDQgMTYzLjg4NSAxMDEuNjg1IDExMS4wODMgNTUuNTM4NyA2OC4xOTMxQzUyLjI3NDkgNjUuMTYzOCA1MS4yNjQzIDYwLjcxMDcgNTIuOTA1MiA1Ni42MDg5QzU0LjU3NTkgNTIuNDQ2OCA1OC4zOTA4IDQ5Ljg3MjcgNjIuOTM4NSA0OS45NzZDODkuOTIyNyA1MC4zNTYxIDEyNi40ODUgNTkuMTYyNCAxNDguNTU3IDk4LjcxMDJDMTYzLjQ4OSA0MS4zNzU4IDE3OC4yNjkgMTUuODQzMSAxODguMTA0IDQuNTEzMDJDMTkwLjA4MyAyLjIxNjg1IDE5My4wOSAxLjA2MTE4IDE5Ni4xMzMgMS4zODA5OEMxOTkuMjA2IDEuNzAwNjYgMjAxLjgwMiAzLjQwNzQgMjAzLjI4OCA2LjA1MTlDMjE2LjkzMiAzMC41NDM5IDIyMi4yOTEgNjIuMDgzOSAyMTkuMTggOTkuODI5M0MyNDguNjQ5IDcyLjM0NCAyODMuMzEzIDcyLjY5NTMgMzA3LjQyNCA3Ny45MzQ3QzMxMS44NTUgNzguODgxNyAzMTUuMDI5IDgyLjI0MjYgMzE1LjcwOCA4Ni42NjY5QzMxNi4zODcgOTEuMDMwOSAzMTQuNDE1IDk1LjEzNCAzMTAuNTM5IDk3LjM0NjlDMjU1LjkwOSAxMjguNzIxIDIzOC44NzIgMTc4Ljk1NyAyMzguNjk0IDE3OS40NjlMMjM4LjQ1NSAxODAuMTMzWk0xMDguNTM5IDE2My42MzhMMjM3LjMwNCAxNzguMzZDMjM5LjQ4IDE3Mi4zODkgMjU3LjgyNSAxMjUuNzMzIDMwOS42NiA5NS45NjVDMzEyLjkzNiA5NC4wODU1IDMxNC42MDkgOTAuNjQ2MSAzMTQuMDIzIDg2Ljk3NDRDMzEzLjQzNyA4My4yNDI0IDMxMC43NDYgODAuNDIxNyAzMDcuMDA5IDc5LjU5MjZDMjgyLjg2NyA3NC4zNTMzIDI0Ny45NjMgNzQuMDkzMyAyMTguNjc5IDEwMi41NzJMMjE3LjA4OSAxMDQuMTEzTDIxNy4yOTEgMTAxLjkxNEMyMjAuNzYgNjMuNTY1MyAyMTUuNTUgMzEuNjAzMiAyMDEuNzg1IDYuOTMwODlDMjAwLjU3MyA0LjczNzA5IDE5OC40MjkgMy4zNTk4OCAxOTUuODk5IDMuMDk4MzhDMTkzLjM5OCAyLjgzNjc3IDE5MC45MDIgMy44MDk4NCAxODkuMjgzIDUuNjgzMDVDMTc5LjQ3OCAxNy4wMTMgMTY0LjYwOSA0Mi43ODcgMTQ5LjU5MSAxMDEuMjM2TDE0OS4wNTYgMTAzLjI4NkwxNDguMDU2IDEwMS40MjJDMTI2LjQ5MiA2MS4wMjk1IDg5LjgzODkgNTIuMTAzMSA2Mi44ODQ5IDUxLjcyMjhDNjIuODI0NyA1MS43MjMxIDYyLjc2NDQgNTEuNzIzMyA2Mi43MDQyIDUxLjcyMzVDNTguOTM5OSA1MS43Mzc3IDU1Ljc4NTkgNTMuODU3NiA1NC4zODM2IDU3LjMyNjFDNTMuMDExMyA2MC43OTQ1IDUzLjgzODUgNjQuNTI1NSA1Ni42MTg3IDY3LjA3NDhDMTAwLjQzOCAxMDcuNzQ1IDEwNy43OTIgMTU3LjM0NiAxMDguNTM5IDE2My42MzhaIiBmaWxsPSIjMDAwMDcyIi8+CjxwYXRoIGQ9Ik0xMDEuMDgzIDE4NC4wNTVDOTYuODQyOSAxNjkuNTg1IDgzLjQ0MSAxMjkuMzczIDYwLjY3MDYgMTEyLjQxNEM1Ni44MzUzIDEwOS41NjcgNTguNDA4NyAxMDMuNTM4IDYzLjEzNCAxMDIuODI4Qzg0LjYyMzkgOTkuNjQ1MSAxMjYuMzc2IDEwMy4xMDIgMTUyLjIxNiAxNjcuNTdDMTUzLjM3MiAxNzAuNDg3IDE1MS44NDggMTczLjc3NSAxNDguODcgMTc0LjcyTDEwNy44NDMgMTg3LjY0M0MxMDQuOTg1IDE4OC41ODcgMTAxLjkzNyAxODYuOTQyIDEwMS4wODMgMTg0LjA1NVoiIGZpbGw9IiMwMDAwNzIiLz4KPHBhdGggZD0iTTEwNi4yNTIgMTg4Ljc3OUMxMDUuMjU4IDE4OC43ODMgMTA0LjIzMyAxODguNTQ2IDEwMy4zMjggMTg4LjAzN0MxMDEuODQ5IDE4Ny4yMyAxMDAuNzYgMTg1LjkwOSAxMDAuMzAyIDE4NC4zMTRDOTUuNjY1IDE2OC40MzEgODIuNDc5NCAxMjkuNjkzIDYwLjE5MjQgMTEzLjEyNEM1OC4xNjg5IDExMS41OTYgNTcuMjg2MyAxMDkuMTMgNTcuOTA5NSAxMDYuNjg4QzU4LjUzMjYgMTA0LjIxNiA2MC40ODMzIDEwMi40MzIgNjMuMDExNiAxMDIuMDYxQzg1LjQ5NDYgOTguNzI0MyAxMjcuMDk4IDEwMi43NTMgMTUyLjk5OSAxNjcuMzEyQzE1My42MzcgMTY4LjkzNiAxNTMuNTg0IDE3MC43NDMgMTUyLjgzNyAxNzIuMzEyQzE1Mi4wOSAxNzMuODggMTUwLjc2OSAxNzUuMDMgMTQ5LjExNSAxNzUuNTQ4TDEwOC4wODggMTg4LjQ3MUMxMDcuNDg2IDE4OC42ODQgMTA2Ljg4NCAxODguNzc3IDEwNi4yNTIgMTg4Ljc3OVpNMTAxLjg2NiAxODMuODU3QzEwMi4yMDIgMTg1LjA2IDEwMy4wMTkgMTg2LjAyMSAxMDQuMTA1IDE4Ni42MTlDMTA1LjE5MiAxODcuMTg3IDEwNi40MjcgMTg3LjMwMyAxMDcuNiAxODYuOTM3TDE0OC42MjggMTc0LjAxNEMxNDkuODMxIDE3My42MTggMTUwLjgyMSAxNzIuNzcxIDE1MS4zNTkgMTcxLjYyNUMxNTEuODk3IDE3MC40NzggMTUxLjk1MiAxNjkuMTIzIDE1MS40NjYgMTY3Ljk1QzEyNS45OSAxMDQuNDQ0IDg1LjI2MDIgMTAwLjQ0MiA2My4yNTg2IDEwMy42ODdDNjEuMDMxNCAxMDQuMDI2IDU5Ljg2MzEgMTA1LjY1NyA1OS41MDcxIDEwNy4wNzRDNTkuMDYyMiAxMDguODgyIDU5LjcwMTQgMTEwLjY4NyA2MS4xODEyIDExMS43OTVDODMuODMwNyAxMjguNjY1IDk3LjE5ODQgMTY3Ljc5MyAxMDEuODY2IDE4My44NTdaIiBmaWxsPSIjMDAwMDcyIi8+CjxnIG9wYWNpdHk9IjAuMjkiPgo8cGF0aCBvcGFjaXR5PSIwLjI5IiBkPSJNMTAxLjA3NiAxODIuNDM2QzEwMS45MzEgMTg1LjMyNCAxMDQuOTc4IDE4Ni45NjkgMTA3LjgzNiAxODYuMDU1TDE0OC44NjMgMTczLjEzMkMxNTEuODQxIDE3Mi4xODcgMTUzLjM5NCAxNjguODY4IDE1Mi4yMDkgMTY1Ljk4MkMxNDkuMDQ4IDE1OC4xMzQgMTQ1LjY3OSAxNTEuMTkgMTQyLjEzMiAxNDUuMDZDMTIzLjcwNCAxNDUuNjcyIDEwNi4xNTcgMTQ4LjE3NyA5MC4wMDA5IDE1Mi4yNDNDOTUuNDk3OSAxNjQuNTA5IDk5LjIxNTIgMTc1Ljk5OSAxMDEuMDc2IDE4Mi40MzZaIiBmaWxsPSIjMDAwMDcyIi8+CjwvZz4KPHBhdGggZD0iTTEwNi4yNzEgMTk0LjkxM0MxMDQuMjUzIDE5NC45MjEgMTAyLjI2NCAxOTQuNDE2IDEwMC40NTQgMTkzLjQ1OUM5Ny40OTY0IDE5MS44NzQgOTUuMzc4NSAxODkuMjYyIDk0LjQzMjggMTg2LjA0NEM5MC45NTQ3IDE3NC4xMDEgNzcuOTE0MyAxMzMuOTQ3IDU2LjUzMzIgMTE4LjAzN0M1Mi41NDY4IDExNS4wNzEgNTAuNzUxIDExMC4wMTggNTEuOTY3NiAxMDUuMTk1QzUzLjE4NCAxMDAuMzQyIDU3LjE3NTcgOTYuNzQzNiA2Mi4xMTE3IDk2LjAwMjJDNzMuNjA5MSA5NC4zMDI2IDkxLjEwNTUgOTQuMjM2NyAxMDkuMjQgMTAzLjcxNUMxMzAuMDYgMTE0LjU2OCAxNDYuNzAxIDEzNS4xOTQgMTU4LjY0OSAxNjUuMDUzQzE1OS45MjUgMTY4LjI0IDE1OS44MTkgMTcxLjg1NCAxNTguMzU1IDE3NC45MzFDMTU2Ljg5MSAxNzguMDA5IDE1NC4xODkgMTgwLjM2OCAxNTAuOTQxIDE4MS40MDRMMTA5LjkxMyAxOTQuMzI3QzEwOC43NCAxOTQuNzIzIDEwNy41MDYgMTk0LjkwOCAxMDYuMjcxIDE5NC45MTNaTTY3LjgyMzQgMTA5LjI5MUM4OS40NTQ3IDEyNy42NyAxMDIuMjcgMTYzLjkxIDEwNy4zMDEgMTgwLjYzNUwxNDUuMTcxIDE2OC42ODdDMTIyLjYxOSAxMTMuOTMzIDg4LjQ3NDggMTA3LjM3NyA2Ny44MjM0IDEwOS4yOTFaIiBmaWxsPSIjMDAwMDcyIi8+CjxwYXRoIGQ9Ik0yMzkuMSAyMTEuNTAxQzI0Ni4zMDcgMTk4LjI1NCAyNjcuOTczIDE2MS44MjQgMjkzLjgyNyAxNTAuMTAyQzI5OC4xODYgMTQ4LjEyOCAyOTcuOTUyIDE0MS44OTUgMjkzLjQ4OSAxNDAuMTk2QzI3My4xNjMgMTMyLjUwMyAyMzEuNjQ0IDEyNi45OTggMTkyLjY1MiAxODQuNTEzQzE5MC44ODUgMTg3LjEwOSAxOTEuNjgxIDE5MC42NiAxOTQuMzk3IDE5Mi4yMTZMMjMxLjcyOSAyMTMuNTc3QzIzNC4zMjUgMjE1LjEwMyAyMzcuNjY0IDIxNC4xMjcgMjM5LjEgMjExLjUwMVoiIGZpbGw9IiMwMDAwNzIiLz4KPHBhdGggZD0iTTIzNC4zNzEgMjE1LjEyMkMyMzMuMjg3IDIxNS4xMjYgMjMyLjIzMiAyMTQuODU5IDIzMS4yOTcgMjE0LjI5MUwxOTMuOTY0IDE5Mi45MjlDMTkyLjQ1NSAxOTIuMDYyIDE5MS40MjYgMTkwLjY1IDE5MS4wMjggMTg4Ljk2NUMxOTAuNjMgMTg3LjI4IDE5MC45ODUgMTg1LjQ3MiAxOTEuOTQzIDE4NC4wNTNDMjMwLjk5NiAxMjYuNDc3IDI3Mi40ODIgMTMxLjM4IDI5My43NDMgMTM5LjQzMUMyOTYuMTI2IDE0MC4zMjYgMjk3LjY3IDE0Mi40ODggMjk3Ljc3IDE0NS4wNDdDMjk3Ljg0IDE0Ny41NzcgMjk2LjQ2MyAxNDkuODEgMjk0LjE0OCAxNTAuODQzQzI2OC44NjQgMTYyLjI5MiAyNDcuNzA1IDE5Ny4zMzUgMjM5LjgxIDIxMS44OEMyMzkuMDAyIDIxMy4zNTggMjM3LjY4MSAyMTQuNDE3IDIzNi4wNTcgMjE0Ljg3NUMyMzUuNDg1IDIxNS4wMjggMjM0Ljk0NCAyMTUuMTIgMjM0LjM3MSAyMTUuMTIyWk0yNjcuNzQzIDEzNi4yNzdDMjQ2LjUxMiAxMzYuMzU3IDIxOS4zODcgMTQ2LjQ4NyAxOTMuMzAyIDE4NC45ODJDMTkyLjU4MyAxODYuMDM4IDE5Mi4zNDcgMTg3LjM2NCAxOTIuNjIzIDE4OC41OThDMTkyLjg5OCAxODkuODMyIDE5My42ODUgMTkwLjg4MyAxOTQuNzcyIDE5MS41MTFMMjMyLjEwNCAyMTIuODcyQzIzMy4xNjEgMjEzLjQ3MSAyMzQuNDI2IDIxMy42NDYgMjM1LjU5OSAyMTMuMzExQzIzNi44MDMgMjEyLjk3NSAyMzcuNzYzIDIxMi4xODggMjM4LjM2MiAyMTEuMTAyQzI0Ni4zNDcgMTk2LjQzNiAyNjcuNzE1IDE2MS4wMzEgMjkzLjQ4IDE0OS4zN0MyOTUuMTYzIDE0OC42MTEgMjk2LjE4MSAxNDYuOTgxIDI5Ni4xNDQgMTQ1LjExNEMyOTYuMTA4IDE0My42MzggMjk1LjI4OCAxNDEuNzc0IDI5My4xNzcgMTQwLjk5OUMyODYuNDgyIDEzOC40MzUgMjc3Ljc3MSAxMzYuMjM5IDI2Ny43NDMgMTM2LjI3N1oiIGZpbGw9IiMwMDAwNzIiLz4KPHBhdGggZD0iTTIzNC4zODYgMjIxLjIyOEMyMzIuMjQ4IDIyMS4yMzYgMjMwLjE2OCAyMjAuNjcyIDIyOC4yNjcgMjE5LjU5NUwxOTAuOTM0IDE5OC4yMzRDMTg3Ljk3NyAxOTYuNTI4IDE4NS44MjggMTkzLjY3NSAxODUuMDYyIDE5MC4zMzZDMTg0LjI5NyAxODYuOTk2IDE4NC45NDYgMTgzLjQ0IDE4Ni44NjMgMTgwLjYwMkMyMDQuODkxIDE1NC4wMDMgMjI1LjU0OCAxMzcuMzYyIDI0OC4yMDEgMTMxLjE5M0MyNjcuOTM2IDEyNS44MTkgMjg1LjAyNSAxMjkuNTc5IDI5NS45MTIgMTMzLjY5NEMzMDAuNTg2IDEzNS40NTMgMzAzLjcwNSAxMzkuODM4IDMwMy44NzQgMTQ0LjgzNkMzMDQuMDQzIDE0OS44MDUgMzAxLjIgMTU0LjM2MyAyOTYuNjYgMTU2LjM5N0MyNzIuMzk5IDE2Ny4zOSAyNTEuMDk1IDIwMy44NzkgMjQ1LjE3MyAyMTQuNzczQzI0My41ODggMjE3LjcgMjQwLjkxNiAyMTkuODE4IDIzNy42OTcgMjIwLjczNEMyMzYuNjE0IDIyMS4wNjkgMjM1LjUgMjIxLjIyNCAyMzQuMzg2IDIyMS4yMjhaTTE5OS4yOTQgMTg3LjAzTDIzMy43NTkgMjA2Ljc0NUMyNDIuMTk0IDE5MS40NzUgMjYyLjQ1OSAxNTguODE1IDI4Ny40OTQgMTQ1LjQ0QzI2Ny43MTUgMTM5LjIyMSAyMzIuOTU5IDEzOC4zMjggMTk5LjI5NCAxODcuMDNaIiBmaWxsPSIjMDAwMDcyIi8+CjxwYXRoIGQ9Ik0xMzQuODggNTMwLjU3OUwxMzIuMTk4IDUzMC4yODhDNTIuMDI5NCA1MjEuMzE1IC01LjY3MTY1IDQ0OS4wNDYgMy4zMzE4MiAzNjguOTA3TDEzLjc2MTQgMjc1LjYzM0MyMS45MTg4IDIwMi43MjUgODcuNjQyIDE1MC4yMjkgMTYwLjU4IDE1OC4zODZMMTg5LjQ3MyAxNjEuNjJDMjYyLjM4MSAxNjkuNzc3IDMxNC44NzcgMjM1LjUgMzA2LjcyIDMwOC40MzhMMjk2LjI5IDQwMS43MTNDMjg3LjI4NyA0ODEuODUyIDIxNS4wMTggNTM5LjU1MiAxMzQuODggNTMwLjU3OVoiIGZpbGw9IiMwMDAwNzIiLz4KPHBhdGggZD0iTTE1MS43OCA1MzIuMzM1QzE0Ni4xNDkgNTMyLjM1NyAxNDAuNDg2IDUzMi4wNDcgMTM0Ljc2MiA1MzEuNDA2TDEzMi4wODEgNTMxLjExNUM1MS42MTA0IDUyMi4xMTIgLTYuNTQ0MiA0NDkuMzA0IDIuNDg4MTIgMzY4LjgzM0wxMi45MTc2IDI3NS41NTlDMTYuODc5NSAyNDAuMDY5IDM0LjQzNyAyMDguMjYyIDYyLjMyOTYgMTg1Ljk5M0M5MC4yMjIyIDE2My43MjMgMTI1LjE0NyAxNTMuNjI0IDE2MC42MDcgMTU3LjYxNkwxODkuNDk5IDE2MC44NUMyNjIuNzM5IDE2OS4wNjYgMzE1LjY1OSAyMzUuMzMgMzA3LjQ3MyAzMDguNTY5TDI5Ny4wNDMgNDAxLjg0M0MyODguNjgyIDQ3Ni41NTkgMjI1LjI1OSA1MzIuMDU4IDE1MS43OCA1MzIuMzM1Wk0xNDUuMDExIDE1OC4zOTdDMTE1LjM3OCAxNTguNTA5IDg2Ljg2NzQgMTY4LjUyNCA2My4zODg1IDE4Ny4yODRDMzUuODI2MSAyMDkuMjgxIDE4LjQ3ODEgMjQwLjcyNiAxNC41NzQ3IDI3NS43NjRMNC4xNDUyIDM2OS4wMzhDLTQuNzcwMDcgNDQ4LjYwNCA1Mi43MTkgNTIwLjYwMyAxMzIuMzE1IDUyOS41MThMMTM0Ljk5NyA1MjkuODA5QzIxNC41NjMgNTM4LjY5NCAyODYuNTYxIDQ4MS4yMzUgMjk1LjQ3NyA0MDEuNjM4TDMwNS45MDYgMzA4LjM2NEMzMTQuMDA1IDIzNS45OTggMjYxLjc1MSAxNzAuNTc1IDE4OS4zODUgMTYyLjQ0NkwxNjAuNDkzIDE1OS4yMTJDMTU1LjI4MSAxNTguNjMgMTUwLjEzIDE1OC4zNzggMTQ1LjAxMSAxNTguMzk3WiIgZmlsbD0iIzAwMDA3MiIvPgo8L3N2Zz4K';
    }
}
