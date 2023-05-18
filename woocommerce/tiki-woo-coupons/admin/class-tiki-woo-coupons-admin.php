<?php
/**
 * The admin-specific functionality of the plugin.
 *
 * PHP version 7
 *
 * @category   Controller
 * @package    Tiki_Woo_Coupons
 * @subpackage Tiki_Woo_Coupons/admin
 * @author     Ricardo Gonçalves <ricardo@mytiki.com>
 * @license    GPL2 https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt
 * @link       https://mytiki.com
 * @since      1.0.0
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, hooks for enqueue the admin-specific
 * stylesheet and JavaScript, and for the admin menu page.
 *
 * PHP version 7
 *
 * @category   View
 * @package    Tiki_Woo_Coupons
 * @subpackage Tiki_Woo_Coupons/admin
 * @author     Ricardo Gonçalves <ricardo@mytiki.com>
 * @license    GPL2 https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt
 * @link       https://mytiki.com
 * @since      1.0.0
 */
class Tiki_Woo_Coupons_Admin {
	/**
	 * The base64 of the menu icon
	 *
	 * @var string $menu_icon
	 */
	private $menu_icon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI3LjUuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkNhbWFkYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8cGF0aCBkPSJNMTg3LjksMTU2LjljLTUuOC0xNC41LTEzLjMtMjkuMi0yNi40LTQwLjFjLTUuMy00LjQtNi42LTkuNS00LjktMTVjMS43LTUuNSw3LTcuNiwxMi41LTcuOWMxLjItMC4xLDIuMy0wLjEsNS4yLTAuNAoJYy02LjQtNi44LTExLjgtMTMuMS0xNy43LTE4LjljLTYuNS02LjItOS0xMy45LTIuOS0yMmMyLjMtMy4xLDYuNi02LjEsMTAuMi02LjZjMTQuMi0xLjYsMjgsMS4yLDQxLjEsNi4yCgljMTUuNyw2LjEsMjkuMSwxNS43LDM5LjgsMjkuNmMyLjktOC43LDUuOC0xNi45LDguNS0yNS4yYzYuMS0xOC4xLDE0LjEtMzUuMywyNS40LTUwLjhjNi4yLTguNSwyMS03LjUsMjYsMS45CgljOC4zLDE2LjEsMTMuNywzMi45LDE0LjgsNTEuMWMwLjUsOC4yLDEuMiwxNi4yLDEuOCwyNC41YzctMy4xLDEzLjktNi44LDIxLjQtOS40YzE4LjUtNi4yLDM3LjQtNi43LDU2LjQtMS43CgljNi41LDEuNywxMC43LDYuMSwxMS43LDEyLjdjMS4xLDctMS42LDEyLjQtNy44LDE2LjZjLTEwLjgsNy4zLTIxLjMsMTUuMy0zMi44LDIzLjdjNi41LDEuOSwxMS4zLDMuMSwxNiw0LjgKCWM0LjYsMS43LDcuMyw1LDcuOSwxMC4xYzAuNiw1LjItMS42LDktNiwxMS4zYy0xMi43LDYuNi0yMi43LDE2LjItMzEsMjcuNWM1LjMsNS42LDEwLjYsMTEuMSwxNS42LDE2LjgKCWMxNC44LDE2LjksMjQsMzYuNywyOC42LDU4LjVjMy43LDE4LDIuOCwzNi4yLDAuMiw1NC4zYy0yLjMsMTYuMi0zLDMyLjctNSw0OC45Yy0yLjgsMjItMy44LDQ0LjItMTMuMSw2NQoJYy05LjQsMjEtMjEuOSwzOS4zLTM5LjcsNTQuNGMtMTkuNSwxNi42LTQxLjYsMjcuMi02Ni41LDMyLjNjLTE3LjgsMy42LTM1LjgsMy41LTUzLjYsMC40Yy0yMS41LTMuOC00MS4zLTExLjktNTkuMi0yNC41CgljLTI5LjgtMjEtNDguNS00OS40LTU3LjMtODQuNWMtNS4yLTIwLjktNC42LTQxLjktMS40LTYzLjFjMS44LTEyLjMsMi4yLTI0LjgsMy44LTM3LjFjMy0yMS4xLDIuOC00Myw5LjctNjMuNAoJYzguMi0yMy45LDIxLjEtNDQuOSw0MS43LTYwLjRDMTY5LjMsMTY5LjcsMTc4LjMsMTYzLjcsMTg3LjksMTU2LjlMMTg3LjksMTU2Ljl6IE0xMTUuNSwzNjYuMWMxLjIsOS43LDEuOCwxOC43LDMuNSwyNy41CgljNiwzMS4xLDIyLjEsNTYuNiw0Ni45LDc2LjFjMzEuMiwyNC42LDY3LjEsMzMuNSwxMDYuMiwyNi43YzQyLjUtNy4zLDczLjUtMzEsOTQuMy02OC41YzE0LjMtMjUuNywxNC44LTU0LjYsMTguMS04Mi44CgljMS40LTEyLjQsMi4zLTI0LjksNC0zNy4zYzIuNC0xNy43LDMuOC0zNS4zLTAuNS01Mi44Yy0xMC4yLTQyLjEtMzUuOC03MS4xLTc2LjMtODYuMmMtMTAuNi00LTIyLjItNS0zMy41LTYuNwoJYy0xNS41LTIuMy0zMC45LTQuNi00Ni45LTIuNmMtMjcuMywzLjItNTAuNSwxNC41LTcwLjEsMzMuNGMtMjQuMywyMy4zLTM0LDUzLjEtMzYuNCw4NS45Yy0xLDEyLjUtMi4zLDI0LjktMy42LDM3LjMKCUMxMTkuMywzMzMsMTE3LjMsMzUwLDExNS41LDM2Ni4xTDExNS41LDM2Ni4xeiBNMjkxLDEyLjdjLTMuOCw1LjktOC40LDEwLjktMTAuOCwxNi44Yy03LjcsMTguOS0xNC44LDM3LjktMjEuOSw1NwoJYy0yLjQsNi40LTMsMTIuNywwLjcsMTkuN2MzLjUsNi42LDUsMTQuMyw3LjEsMjEuNmMwLjgsMy4yLDAuOCw2LjcsMS4yLDEwLjFjNC4zLTkuNSw0LjktMTkuOSwxMi0yNy42YzAuNiwwLjEsMS4xLDAuMiwxLjcsMC41CgljMSw4LjQsMiwxNi43LDIuOCwyMi44YzUuOS05LjUsMTIuNy0yMC40LDE5LjUtMzEuNGMxLjMtMi4zLDMtNC45LDMtNy4zYy0wLjUtMTUuNS0wLjgtMzEtMi40LTQ2LjRDMzAyLjQsMzYsMjk3LjksMjQuMywyOTEsMTIuNwoJTDI5MSwxMi43eiBNMzk3LjIsODcuNGMtMC40LTAuNi0wLjYtMS4yLTEtMS43Yy0yMi44LTQuOS00NC43LTMuOC02NC45LDEwYy0xOS44LDEzLjYtMzEuMSwzMi4zLTM2LDU1LjRjNi43LDEuNiw5LjYtMywxMy4xLTUuOQoJYzExLjMtOS42LDIzLjktMTYuMywzOC42LTE5YzIuOC0wLjUsNi4xLTEuNCw3LjgtMy41YzEwLjEtMTIuNCwyMi42LTIxLjksMzYtMzAuMkMzOTMsOTEsMzk1LjEsODkuMSwzOTcuMiw4Ny40TDM5Ny4yLDg3LjR6CgkgTTI1Mi43LDE0Ni40YzMuNy0yNi0xOC02Mi4xLTQxLjktNzUuOGMtMTYuNi05LjUtNDAuNy0xMy45LTQ1LjgtOS4zYzcuMSw4LjMsMTQuMiwxNi42LDIxLjQsMjQuOGMzLDMuNSw1LjgsOC41LDkuNiw5LjYKCWMxOCw1LjUsMzIuNiwxNS4zLDQzLjMsMzAuOUMyNDMuNCwxMzMsMjQ3LjYsMTM5LjIsMjUyLjcsMTQ2LjRMMjUyLjcsMTQ2LjR6IE0yMDMuOSwxMTMuOWMzLjUsMTEuMyw2LjcsMjIuMSwxMC4xLDMyLjgKCWMwLjQsMSwyLDIuMywyLjksMi4yYzUuOC0wLjgsMTEuNC0xLjksMTcuOC0zLjFDMjI3LjQsMTMyLjEsMjE3LjUsMTIxLjYsMjAzLjksMTEzLjlMMjAzLjksMTEzLjl6IE0zNzQuNywxNDAuOAoJYy0xLjMtMC40LTMuMi0xLTUuMi0xLjFjLTQuNi0wLjQtOS43LTItMTMsM2MtNC43LDcuMi05LDE0LjctMTMuNiwyMS45Yy0yLDMuMS0xLjEsNC45LDEuMiw1LjYKCUMzNTQuNywxNjAuMSwzNjQuOCwxNTAuNCwzNzQuNywxNDAuOEwzNzQuNywxNDAuOHogTTE3NS40LDEwOC41YzcuMiwxMC41LDE0LjMsMjAuOCwyMS40LDMxLjFjLTIuNi04LjMtNi40LTE2LjEtOS40LTI0LjIKCUMxODUuMiwxMDkuMiwxODEuNSwxMDYuNCwxNzUuNCwxMDguNUwxNzUuNCwxMDguNXogTTMzNy40LDE0NC45Yy0wLjQtMC40LTAuNy0wLjgtMS4yLTEuMmMtNi41LDQuMS0xMi45LDguMi0yMC4xLDEyLjcKCWM1LDEuOSw4LjcsMy4yLDEyLjMsNC43QzMzMS42LDE1NS40LDMzNC41LDE1MC4yLDMzNy40LDE0NC45eiIvPgo8L3N2Zz4K';

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
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version     = $version;
	}

	/**
	 * Register the stylesheets for the admin area.∏
	 */
	public function enqueue_styles() {
		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/tiki-woo-coupons-admin.css', array(), $this->version, 'all' );
		wp_enqueue_style( 'wp-color-picker' );
	}

	/**
	 * Register the JavaScript for the admin area.
	 */
	public function enqueue_scripts() {
		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/tiki-woo-coupons-admin.js', array( 'jquery' ), $this->version, false );
		wp_enqueue_script( 'iris', admin_url( 'js/iris.min.js' ), array( 'jquery-ui-draggable', 'jquery-ui-slider', 'jquery-touch-punch' ), $this->version, 1 );
		wp_add_inline_script(
			'iris',
			'
				jQuery(".color-picker").iris();
			',
			'after'
		);

	}

	/**
	 * Register the admin menu page.
	 */
	public function add_menu_page() {
		if ( empty( $GLOBALS['admin_page_hooks']['tiki_menu_page'] ) ) {
			add_menu_page(
				'TIKI',
				'TIKI',
				'manage_options',
				'tiki_menu_page',
				array( $this, 'display_tiki_menu_page' ),
				$this->menu_icon
			);
		}
		add_submenu_page(
			'tiki_menu_page',
			'TIKI WooCommerce Coupons',
			'WooCommerce Coupouns',
			'manage_options',
			'tiki_woo_coupouns',
			array( $this, 'display_tiki_coupons_submenu_page' )
		);
	}

	/**
	 * Renders TIKI Menu Page
	 */
	public function display_tiki_menu_page() {
		$options = get_option( 'tiki_woo_coupons' );
		include_once 'partials/tiki-woo-coupons-admin-sdk-options.php';
	}

		/**
	 * Renders TIKI Coupons Sub Menu Page
	 */
	public function display_tiki_coupons_submenu_page() {
		$options = get_option( 'tiki_woo_coupons' );
		include_once 'partials/tiki-woo-coupons-admin-options.php';
	}
}
