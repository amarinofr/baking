import { useQuery } from '@tanstack/react-query'
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
    // const [isLoading, setIsLoading] = useState(false)

    const { data: ingredients, isLoading } = useQuery<Ingredient[]>({
        queryKey: ['ingredients'],
        queryFn: async () => {
            try {
                const res = await fetch('http://localhost:3000/api/ingredients')
                const data = await res.json()

                if (!res.ok) {
                    throw new Error(data.error || 'Failed to fetch ingredients')
                }

                return data || []
            } catch (error) {
                console.error(error)
            }
        },
    })

    console.log(ingredients)

    return (
        <>
            <div>
                {ingredients?.map((ingredient) => (
                    <div key={ingredient._id}>
                        <p>{ingredient.name}</p>
                        <p>
                            {ingredient.quantity} {ingredient.unit}
                        </p>
                        <p>{ingredient.nutrition.calories} calories</p>
                        <p>{ingredient.nutrition.protein} protein</p>
                        <p>{ingredient.nutrition.fat} fat</p>
                        <p>{ingredient.nutrition.carbs.netCarbs} net carbs</p>
                        <p>
                            {ingredient.nutrition.carbs.totalCarbs} total carbs
                        </p>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Ingredient
