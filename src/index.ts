import PRODUCTS from './data/products.json'
import { Product, Bucket, BucketCountry, CostByCountry, ListOfCostByCountry } from './types'
import inquirer from 'inquirer'

const products = PRODUCTS as Product[]

function openConsole() {
    console.log("Hey, bienvenido! Ingresa el código del producto y la cantidad que necesitas para calcular el costo total y la mejor opción de compra.");

    inquirer.prompt([
        'Ingresa el código del producto',
        'Ingresa la cantidad de pintura que necesitas (en litros)'
    ]).then(answers => {
        // Validate the input
        const productId = answers[0]
        const quantity = answers[1]
        validateInput(productId, quantity);

        // Get the product
        const product = getProductById(productId);
        const result = main(product!, quantity)
        console.log('result', result)
    }).catch(error => {
        if (error.isTtyError) {
            console.error("No podemos mostrar el prompt aqui :(")
        } else {
            console.error(error.message)
        }
    })
}

function validateInput(productId: string, quantity: number): void {
    if (!productId) {
        throw new Error("El código del producto no puede estar vacío");
    }

    const productExists = getProductById(productId);
    if (!productExists) {
        throw new Error("El producto no existe");
    }

    if (!quantity) {
        throw new Error("La cantidad de pintura no puede estar vacía");
    }

    const quantityNumber = Number(quantity);
    if (isNaN(quantityNumber)) {
        throw new Error("La cantidad de pintura debe ser un número");
    }
}

function main(product: Product, quantity: number) {
    // Search by parts of the product
    const listTotalCostByCountry = {} as ListOfCostByCountry
    for (let part of product.parts) {
        // Calculate the total needed of the part and some other data related
        const totalNeeded = quantity * part.proportion;
        const partName = part.name;
        const buckets = part.bucketsSizes;

        // Get the available countries on the array
        const availableCountries = getAvailableCountries(buckets);

        // Let's search the best option for each country.
        for (const country of availableCountries) {
            const bucketsByCountry = buckets.filter(bucket => bucket.country === country);
            const bucketsNeeded = calculateBucketsNeeded(bucketsByCountry, totalNeeded);

            // Let's store in a big object all the options for each country. This includes the country, the total costo of all the products, and a list of all the presentations (buckets) needed for each part.
            listTotalCostByCountry[country] = {
                ...listTotalCostByCountry[country],
                country: country,
                totalCost: calculateTotalCostByBuckets(bucketsNeeded, listTotalCostByCountry[country]?.totalCost),
                buckets: {
                    ...listTotalCostByCountry[country]?.buckets,
                    [partName]: [...listTotalCostByCountry[country]?.buckets?.[partName] ?? [], ...bucketsNeeded]
                }
            }
        }
    }

    return getLessExpensiveCountry(listTotalCostByCountry);
}

function getProductById(productId: string): Product | undefined {
    return products.find(product => product.id === productId);
}

// Calculate the least expensive country (it checks the total cost and the amount of products)
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

// Calculate the total cost of a list of buckets.
function calculateTotalCostByBuckets(buckets: Bucket[], initialValue?: number): number {
    return buckets.reduce((acc, bucket) => acc + bucket.price, initialValue ?? 0);
}

// Calculate the buckets needed to reach the liters needed. This is where the magic happens!
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

// 
function sortProductsByLitersAsc(products: Bucket[]): Bucket[] {
    return [...products].sort((a, b) => a.liters - b.liters);
}

// Sort the products by liters descending
function sortProductsByLitersDesc(products: Bucket[]): Bucket[] {
    return [...products].sort((a, b) => b.liters - a.liters);
}

// Get the available countries from a list of buckets
function getAvailableCountries(buckets: Bucket[]): BucketCountry[] {
    const allCountries = buckets.map(bucket => bucket.country);
    return [...new Set(allCountries)]
}

openConsole();