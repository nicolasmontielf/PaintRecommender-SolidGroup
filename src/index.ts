import PRODUCTS from './data/products.json'
import { Product, Bucket, BucketCountry, CostByCountry, ListOfCostByCountry } from './types'

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

    const listTotalCostByCountry = {} as ListOfCostByCountry
    for (let part of product.parts) {
        const totalNeeded = userInputQuantity * part.proportion;
        const buckets = part.bucketsSizes;
        const availableCountries = getAvailableCountries(buckets);

        for (const country of availableCountries) {
            const bucketsByCountry = buckets.filter(bucket => bucket.country === country);
            const bucketsNeeded = calculateBucketsNeeded(bucketsByCountry, totalNeeded);

            listTotalCostByCountry[country] = {
                ...listTotalCostByCountry[country],
                country: country,
                totalCost: calculateTotalCostByBuckets(bucketsNeeded, listTotalCostByCountry[country]?.totalCost),
                buckets: [...listTotalCostByCountry[country]?.buckets ?? [], ...bucketsNeeded]
            }
        }
    }

    const lessExpensiveCountry = getLessExpensiveCountry(listTotalCostByCountry);

    console.table({xd: lessExpensiveCountry.buckets[0]});
}

function getLessExpensiveCountry(countries: ListOfCostByCountry): CostByCountry {
    let countryKey: BucketCountry;
    let betterOption: CostByCountry | undefined;

    for (countryKey in countries) {
        const option = countries[countryKey];
        if (
            !betterOption ||
            option!.totalCost < betterOption.totalCost || 
            (option!.totalCost == betterOption.totalCost && option!.buckets.length < betterOption.buckets.length)
        ) {
            betterOption = option;
        }
    }

    return betterOption!;
}

function calculateTotalCostByBuckets(buckets: Bucket[], initialValue?: number): number {
    return buckets.reduce((acc, bucket) => acc + bucket.price, initialValue ?? 0);
}

function calculateBucketsNeeded(arrayProducts: Bucket[], litersNeeded: number): Bucket[] {
    // Clone the array to avoid mutating the original
    const products = sortProductsByLitersDesc(arrayProducts)

    // Initialize some variables
    const productsNeeded = [];
    let litersAccumulator = 0;

    // Go through the products and add them to the list of products needed
    for (const product of products) {
        while (litersAccumulator + product.liters <= litersNeeded) {
            // Add the product to the list of products needed
            productsNeeded.push(product);

            // Update the liters accumulator
            litersAccumulator += product.liters;
        }
    }

    // If the liters accumulator is still less than the liters needed, add the best option
    if (litersAccumulator < litersNeeded) {
        for (const product of sortProductsByLitersAsc(products)) {
            if (litersAccumulator + product.liters > litersNeeded) {
                productsNeeded.push(product);
                litersAccumulator += product.liters;
                break;
            }
        }
    }

    return productsNeeded;
}

function sortProductsByLitersAsc(products: Bucket[]): Bucket[] {
    return [...products].sort((a, b) => a.liters - b.liters);
}

function sortProductsByLitersDesc(products: Bucket[]): Bucket[] {
    return [...products].sort((a, b) => b.liters - a.liters);
}

function getAvailableCountries(buckets: Bucket[]): BucketCountry[] {
    const allCountries = buckets.map(bucket => bucket.country);
    return [...new Set(allCountries)]
}


main();