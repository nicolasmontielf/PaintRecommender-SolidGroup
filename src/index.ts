import PRODUCTS from './data/products.json'
import { Product, BucketSizes, BucketCountry } from './types'

const products = PRODUCTS as Product[]

function main() {
    const userInputCodigoProducto = "652498b4e708dbf6092c8451";
    const userInputQuantity = 320;

    // Find product
    const product = products.find(product => product.id === userInputCodigoProducto);
    if (!product) {
        console.log("No se encontró el producto");
        return;
    }

    for (let part of product.parts) {
        const buckets = part.bucketsSizes;
        const availableCountries = getAvailableCountries(buckets);
        
        for (let country of availableCountries) {
            
        }

    }
}

function getAvailableCountries(buckets: BucketSizes[]): BucketCountry[] {
    const allCountries = buckets.map(bucket => bucket.country);
    return [...new Set(allCountries)]
}


main();