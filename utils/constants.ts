export const CONSTANTS = {
  URLs: {
    BASE: 'https://www.saucedemo.com',
    INVENTORY: '/inventory.html',
    CART: '/cart.html',
    CHECKOUT_STEP_ONE: '/checkout-step-one.html',
    CHECKOUT_STEP_TWO: '/checkout-step-two.html',
    CHECKOUT_COMPLETE: '/checkout-complete.html',
  },

  Timeouts: {
    SHORT: 5000,
    MEDIUM: 10000,
    LONG: 15000,
    VERY_LONG: 30000,
  },

  Users: {
    STANDARD: { username: 'standard_user', password: 'secret_sauce' },
    LOCKED_OUT: { username: 'locked_out_user', password: 'secret_sauce' },
    PROBLEM: { username: 'problem_user', password: 'secret_sauce' },
    PERFORMANCE_GLITCH: { username: 'performance_glitch_user', password: 'secret_sauce' },
    ERROR: { username: 'error_user', password: 'secret_sauce' },
    VISUAL: { username: 'visual_user', password: 'secret_sauce' },
  },

  Products: [
    { name: 'Sauce Labs Backpack', price: '$29.99', id: 'sauce-labs-backpack' },
    { name: 'Sauce Labs Bike Light', price: '$9.99', id: 'sauce-labs-bike-light' },
    { name: 'Sauce Labs Bolt T-Shirt', price: '$15.99', id: 'sauce-labs-bolt-t-shirt' },
    { name: 'Sauce Labs Fleece Jacket', price: '$49.99', id: 'sauce-labs-fleece-jacket' },
    { name: 'Sauce Labs Onesie', price: '$7.99', id: 'sauce-labs-onesie' },
    { name: 'Test.allTheThings() T-Shirt (Red)', price: '$15.99', id: 'test.allthethings-t-shirt-(red)' },
  ],

  SortOptions: {
    NAME_AZ: { value: 'az', label: 'Name (A to Z)' },
    NAME_ZA: { value: 'za', label: 'Name (Z to A)' },
    PRICE_LOW_HIGH: { value: 'lohi', label: 'Price (low to high)' },
    PRICE_HIGH_LOW: { value: 'hilo', label: 'Price (high to low)' },
  },

  Selectors: {
    USERNAME: '#user-name',
    PASSWORD: '#password',
    LOGIN_BUTTON: '#login-button',
    ERROR_MESSAGE: '[data-test="error"]',
    INVENTORY_LIST: '.inventory_list',
    INVENTORY_ITEM: '.inventory_item',
    INVENTORY_ITEM_NAME: '.inventory_item_name',
    INVENTORY_ITEM_PRICE: '.inventory_item_price',
    CART_BADGE: '.shopping_cart_badge',
    CART_LINK: '.shopping_cart_link',
    SORT_DROPDOWN: '.product_sort_container',
    CHECKOUT_FIRST_NAME: '#first-name',
    CHECKOUT_LAST_NAME: '#last-name',
    CHECKOUT_POSTAL_CODE: '#postal-code',
  },

  ErrorMessages: {
    LOCKED_OUT: 'Sorry, this user has been locked out.',
    INVALID_CREDENTIALS: 'Username and password do not match',
    EMPTY_USERNAME: 'Username is required',
    EMPTY_PASSWORD: 'Password is required',
    EMPTY_FIELDS: 'Username is required',
  },
};
