/** API HOST THEO 3 MÔI TRƯỜNG */
export const api_host: { [index: string]: { [index: string]: string } } = {
    development: {
        contact: "https://api-contact.merchant.vn",
        product: "https://api-product.merchant.vn",
        pickleyard: "https://pickleyard.somee.com/api",  // Thay bằng đường dẫn API dev
        
    },
    staging: {
        pickleyard: "https://staging-pickleyard.somee.com/api",
    },
    production: {
        contact: "https://api-contact.merchant.vn",
        product: "https://api-product.merchant.vn",
        pickleyard: "https://pickleyard.somee.com/api",
    },
};

