# TIKI Shopify App
Introducing the TIKI Shopify App, your go-to solution for effortlessly creating irresistible discount strategies that your customers will adore, all while capturing the precise data you need.

Powered by the TIKI SDK JavaScript, it seamlessly integrates the TIKI Zero Party Data Licensing infrastructure into your Shopify store, by offering to your clients discounts in exchange for their consent to share anonymous purchase information.

Unlock the full potential of your earnings with Zero Party Data pooling by licensing valuable data to leading martech, fintech, and AI companies and earn using the cutting-edge TIKI Infrastructure.

### Requires

- A [Shopify Store](https://www.shopify.com/).

## How it works
Upon app instalation, a new TIKI project is created for the shop. This account is used by the app to create License, Payable and Receipt records in the TIKI infrastructure.

When a user visits the shop it will be presented by the TIKI banner, asking for their consent to share their anonymized purchase data in exchange for the discount. If the user agrees, the automatic discount is applied to all their purchases, based on the rules that the shop owner configured in the app settings.

The app offers full customization of the discount options and the banner UI and texts, as well as default plug-n-play options for those who doesn't want to configure anything.
-  

### Limits
#### Anonymous checkout
At the moment it is not possible to track anonymous checkouts. The customer needs to create an user account in the shop to opt-in for the discounts. This feature will be available in future versions of the app.

## Get Started
### Installation
1. Log in to the [Shopify App Store](https://apps.shopify.com/).
2. Search for the TIKI app and then click it.
3. On the app listing page, click Add app.
4. In your Shopify admin, to authorize the use of the app, click Install app.

After the instalation, the app redirects to the Discounts page in the Shopify admin, to create the Discount that the users will get by opting in.

### Discount options
1. In the Discounts page, click in 'Create discount'
2. Select the discount type:
- TIKI Product discount: applied per product 
- TIKI Order discount: applied to the order
3. Configure the discounts using the following options:
- Discount value: choose between percentage and fixed value and type in the value
- Purchase type: if the discount is valid for one-time purchase, subscription or both
- Specific collections/products: the discount is just applied in the specific collections/products
- Minimum purchase amount: minimum to apply the discount
- Minimum quantity of items: minimum toa apply the discount
- Specific customers / customer segments: the discount is just applied in the specific customers/segments
- Limit number of times this discount can be used in total
- Limit to one use per customer
- Combinations: does the discount can be applied with other discounts
- Active dates: the start and end date of the discounts
4. Save the discount

After saving it will appear in the discount list as Active. The discount must be active before it can be added to an offer.
### UI Personalization
With the discount configured, it is time to configure the offer that will be presented to the user, starting by the UI.

The TIKI banner is added as an embeded block in the store. In the Theme Editor it can be personalized to match the visual ID of the shop.

To preview the banner while editing it, click in the "preview" checkbox in app settings.

1. In the menu, click in Online Store -> Themes
2. In the current theme menu, click in Customize.
3. In the right hand toolbar in theme customizer page, click in the "App embeds" icon
4. Turn TIKI 'on' and open the options by clicking in the TIKI app name.

To preview the banner during customizaion, check the "preview" box.

The appearance of the UI components is customized using the following settings.

**Colors**
- Primary Text Color - default `#00001C` ![#00001C](https://placehold.co/15x15/00001C/00001C.png) ,
- Secondary Text Color - default `#9900001C` ![#9900001C](https://placehold.co/15x15/1C0000/1C0000.png) -> with alpha 60%, 
- Primary_background color - default `#FFFFFF` ![#FFFFFF](https://placehold.co/15x15/FFFFFF/FFFFFF.png) ,
- Secondary_background color - default `#F6F6F6` ![#F6F6F6](https://placehold.co/15x15/F6F6F6/F6F6F6.png),
- Accent color - default ![#00b272](https://placehold.co/15x15/00b272/00b272.png) `#00b272`,

**Font**

Before using a custom font family make sure to [set it with @fontface using CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face).

- Font Family - default "Space Grotesk"

### Offer Configuration
In the same screen the offer configuration is available. These settings have default options and are doesn't need customization.

- **Description**: Small text to add user-friendly details to the Offer. We recommend including details like the type of data the user is trading and participation requirements.
- **Offer image**: A 300 x 86 resolution image that illustrates the offer. We've elected to make this portion of the UI an image; so you can get as fancy/detailed as you'd like. We strongly recommend the image to be compelling, easy to understand, and focused on the incentive for the user to participate (hence, why it's called the reward image). The reward always goes hand in hand with the text Description (like a caption), so avoid over crowding it with too much text.
- **Offer use case 1, 2 and 3**: The bullets that will explain to the user how their data will or will NOT be used. When creating your bullets, it's important to use terminology users are familiar with. Words like attribution, lead to confusion and lower opt-in rates.
- **Offer terms**: The terms and conditions for this offer agreement. We have default terms in place that you can customize with proper advice.

After configuring the appearence of the banner and the offer details, click "Save" in the top right corner.

### That's it!
Open a new browser window and go to your website's homepage while logged in. If everything is set up correctly, you should see the TIKI banner as configured in the Theme Editor.
