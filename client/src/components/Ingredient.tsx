import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'

export interface Ingredient {
    _id: string
    name: string
    quantity: number
    unit: string
    nutrition: {
        calories: number
        protein: number
        fat: number
        carbs: {
            netCarbs: number
            totalCarbs: number
        }
    }
}

function Ingredient({ ingredient }: { ingredient: Ingredient }) {
    const [isLoading, setIsLoading] = useState(false)

    const { data: ingredients } = useQuery<Ingredient[]>({
        queryKey: ['ingredients'],
        queryFn: async () => {
            setIsLoading(true)
            try {
                const res = await fetch('http://localhost:3000/api/ingredients')
                const data = await res.json()

                if (!res.ok) {
                    throw new Error(data.error || 'Failed to fetch ingredients')
                }

                return data || []
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        },
    })

    console.log(ingredients)
    return (
        <>
            <div>
                <form
                    action="createIngredient"
                    className="[&_input]:border-2 [&_input]:border-gray-300 [&_input]:rounded-md [&_input]:p-2 [&_button]:bg-blue-500 [&_button]:text-white [&_button]:rounded-md [&_button]:p-2 [&_button]:hover:bg-blue-600"
                >
                    <input type="text" name="name" placeholder="Name" />
                    <input
                        type="number"
                        name="quantity"
                        placeholder="Quantity"
                    />
                    <input type="text" name="unit" placeholder="Unit" />
                    <button type="submit">Create</button>
                </form>
            </div>
        </>
    )
}

export default Ingredient
