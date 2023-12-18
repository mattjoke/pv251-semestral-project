/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js,svelte,ts}', "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}"],
    plugins: [
        require('flowbite/plugin')
    ],
    theme: {
        extend: {}
    }
};