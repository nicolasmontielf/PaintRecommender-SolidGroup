export interface Product {
    id: string,
    name: string
    parts: ProductPart[]
}

export interface ProductPart {
    proportion: number,
    bucketsSizes: BucketSizes[]
}

export interface BucketSizes {
    country: BucketCountry,
    presentation: BucketPresentation,
    liters: number,
    price: number
}

export type BucketCountry = "GUA" | "PY" | "CH" | "AR"

export type BucketPresentation = "cuarto" | "galon" | "balde" | "tambor"