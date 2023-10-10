export interface Product {
    id: string,
    name: string
    parts: ProductPart[]
}

export interface ProductPart {
    name: string,
    proportion: number,
    bucketsSizes: Bucket[]
}

export interface Bucket {
    country: BucketCountry,
    presentation: BucketPresentation,
    liters: number,
    price: number
}

export type BucketCountry = "GUA" | "PY" | "CH" | "AR"

export type BucketPresentation = "cuarto" | "galon" | "balde" | "tambor"

export interface CostByCountry {
    country: BucketCountry,
    totalCost: number,
    buckets: {
        [part: string]: Bucket[]
    }
}

export type ListOfCostByCountry = {
    [key in BucketCountry]?: CostByCountry
}