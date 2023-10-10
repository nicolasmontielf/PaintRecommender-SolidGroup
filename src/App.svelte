<script lang="ts">
    import { validateInput, calculateCostByCountry, orderByLessExpensiveCountry } from './helpers'
    import type { CostByCountry } from './types'

    let code = ''
    let quantity = ''
    let products: CostByCountry[];

    function search(): void {
        let product = null
        try {
            product = validateInput(code, Number(quantity))
        } catch (error) {
            console.log(error.message)
            return;
        }

        const listOfBuckets = calculateCostByCountry(product!, Number(quantity))
        products = orderByLessExpensiveCountry(listOfBuckets)
    }
    
    function handleCodeChange(event: Event): void {
        code = (event.target as HTMLInputElement).value
    }

    function handleQuantityChange(event: Event): void {
        quantity = (event.target as HTMLInputElement).value
    }
</script>

<main>
    <div>
        <input
            type="text"
            placeholder="Ingrese el codigo del producto"
            bind:value={code}
            on:input={handleCodeChange}
        />

        <input
            type="number"
            placeholder="Ingrese la cantidad que necesita (en litros)"
            bind:value={quantity}
            on:input={handleQuantityChange}
        />

        <button on:click={search}>Buscar</button>
    </div>

    <div>
        <h2>Resultados</h2>
            {#if (products ?? []).length}
                <table>
                    <thead>
                        <tr>
                            <th>País</th>
                            <th>Costo</th>
                            <th>Pintura</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each products as product}
                            <tr>
                                <td>{product.country}</td>
                                <td>{product.totalCost}USD</td>
                                <td>
                                    {#each Object.entries(product.buckets) as [typeOfPaint, paint]}
                                        <div>
                                            Tipo {typeOfPaint} => {paint.length} unidades 
                                        </div>
                                    {/each}
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            {/if}
    </div>
</main>

<style>
    table {
        width: 100%;
        border-collapse: collapse;
        font-family: Tahoma, Geneva, sans-serif;
    }
    table td {
        padding: 15px;
    }
    table thead td {
        background-color: #54585d;
        color: #ffffff;
        font-weight: bold;
        font-size: 13px;
        border: 1px solid #54585d;
    }
    table tbody td {
        color: #636363;
        border: 1px solid #dddfe1;
    }
    table tbody tr {
        background-color: #f9fafb;
    }
    table tbody tr:nth-child(odd) {
        background-color: #ffffff;
    }

    input {
        padding: 10px;
        margin: 5px;
        border-radius: 5px;
        border: 1px solid #dddfe1;
    }
</style>
