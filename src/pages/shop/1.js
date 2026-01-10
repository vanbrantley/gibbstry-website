"use client";

import { useEffect } from "react";

export default function Product1() {
    useEffect(() => {
        const scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';

        function ShopifyBuyInit() {
            const client = ShopifyBuy.buildClient({
                domain: '0kf81w-3q.myshopify.com',
                storefrontAccessToken: 'f31d807f39b5732b0e1e6376e4c3c3d6',
            });

            // Replace this function with the updated function values from the Shopify Buy Now Button generated code
            ShopifyBuy.UI.onReady(client).then(function (ui) {
                ui.createComponent('product', {
                    id: '14924593168750',
                    node: document.getElementById('product-component-1768066582125'),
                    moneyFormat: '%24%7B%7Bamount%7D%7D',
                    options: {
                        "product": {
                            "styles": {
                                "product": {
                                    "@media (min-width: 601px)": {
                                        "max-width": "100%",
                                        "margin-left": "0",
                                        "margin-bottom": "50px"
                                    },
                                    "text-align": "left"
                                },
                                "title": {
                                    "font-size": "26px"
                                },
                                "price": {
                                    "font-size": "18px"
                                },
                                "compareAt": {
                                    "font-size": "15.299999999999999px"
                                },
                                "unitPrice": {
                                    "font-size": "15.299999999999999px"
                                }
                            },
                            "layout": "horizontal",
                            "contents": {
                                "img": false,
                                "imgWithCarousel": true,
                                "description": true
                            },
                            "width": "100%",
                            "text": {
                                "button": "Add to cart"
                            }
                        },
                        "productSet": {
                            "styles": {
                                "products": {
                                    "@media (min-width: 601px)": {
                                        "margin-left": "-20px"
                                    }
                                }
                            }
                        },
                        "modalProduct": {
                            "contents": {
                                "img": false,
                                "imgWithCarousel": true,
                                "button": false,
                                "buttonWithQuantity": true
                            },
                            "styles": {
                                "product": {
                                    "@media (min-width: 601px)": {
                                        "max-width": "100%",
                                        "margin-left": "0px",
                                        "margin-bottom": "0px"
                                    }
                                },
                                "title": {
                                    "font-family": "Helvetica Neue, sans-serif",
                                    "font-weight": "bold",
                                    "font-size": "26px",
                                    "color": "#4c4c4c"
                                },
                                "price": {
                                    "font-family": "Helvetica Neue, sans-serif",
                                    "font-weight": "normal",
                                    "font-size": "18px",
                                    "color": "#4c4c4c"
                                },
                                "compareAt": {
                                    "font-family": "Helvetica Neue, sans-serif",
                                    "font-weight": "normal",
                                    "font-size": "15.299999999999999px",
                                    "color": "#4c4c4c"
                                },
                                "unitPrice": {
                                    "font-family": "Helvetica Neue, sans-serif",
                                    "font-weight": "normal",
                                    "font-size": "15.299999999999999px",
                                    "color": "#4c4c4c"
                                }
                            },
                            "text": {
                                "button": "Add to cart"
                            }
                        },
                        "option": {},
                        "cart": {
                            "text": {
                                "total": "Subtotal",
                                "button": "Checkout"
                            }
                        },
                        "toggle": {}
                    },
                });
            });
            // end of block to replace
        }

        function loadScript() {
            const script = document.createElement('script');
            script.src = scriptURL;
            script.async = true;
            script.onload = ShopifyBuyInit;
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
        }

        if (window.ShopifyBuy) {
            if (window.ShopifyBuy.UI) {
                ShopifyBuyInit();
            } else {
                loadScript();
            }
        } else {
            loadScript();
        }
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-2xl">
                {/* Replace this line with the top line of the generated code from Shopify Buy Now Button */}
                <div id="product-component-1768066582125"></div>
            </div>
        </div>
    );

}