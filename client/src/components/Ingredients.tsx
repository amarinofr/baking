import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import EditIngredient from './EditIngredient'
import CreateIngredient from './CreateIngredient'

export interface Ingredients {
    _id: string
    name: string
    type: string
    quantity: number
    unit: string
    nutrition: {
        calories: number
        protein: number
        fat: number
        carbs: {
            fiber: number
            sugar: number
            totalCarbs: number
        }
    }
    price: number
}

function Ingredients({ baseUrl }: { baseUrl: string }) {
    const queryClient = useQueryClient()

    const fetchIngredients = async () => {
        try {
            const res = await fetch(baseUrl + 'ingredients')
            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Failed to fetch ingredients')
            }

            return data || []
        } catch (error) {
            console.error(error)
        } finally {
        }
    }

    const { data: ingredients, isLoading } = useQuery<Ingredients[]>({
        queryKey: ['ingredients'],
        queryFn: fetchIngredients,
    })

    // const { mutate: editIngredient, isPending: isEditing } = useMutation({
    //     mutationKey: ['edit-ingredient'],
    //     mutationFn: async (ingredient: Ingredients) => {
    //         try {
    //             const res = await fetch(
    //                 baseUrl + 'ingredients/' + ingredient._id,
    //                 {
    //                     method: 'PUT',
    //                     headers: {
    //                         'Content-Type': 'application/json',
    //                     },
    //                     body: JSON.stringify(ingredient),
    //                 }
    //             )
    //             const data = await res.json()

    //             if (!res.ok) {
    //                 throw new Error(data.error || 'Failed to edit ingredient')
    //             }

    //             console.log(data)

    //             return data
    //         } catch (error: any) {
    //             throw new Error(error as string)
    //         }
    //     },
    // })

    const { mutate: deleteIngredient, isPending: isDeleting } = useMutation({
        mutationKey: ['delete-ingredient'],
        mutationFn: async (id: string) => {
            if (confirm('Are you sure you want to delete this ingredient?')) {
                try {
                    const res = await fetch(baseUrl + 'ingredients/' + id, {
                        method: 'DELETE',
                    })
                    const data = await res.json()

                    if (!res.ok) {
                        throw new Error(
                            data.error || 'Failed to delete ingredient'
                        )
                    }

                    return data
                } catch (error: any) {
                    throw new Error(error as string)
                }
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ingredients'] })
        },
        onError: (error: any) => {
            console.error(error.message)
        },
    })

    if (isLoading) return <div>Loading...</div>
    if (!ingredients) return null

    return (
        <>
            <div
                className={`${
                    ingredients.length > 0 ? 'block' : 'hidden'
                } p-10 border border-gray-300 rounded-md`}>
                <ul>
                    {ingredients?.map((ingredient) => (
                        <li
                            onClick={() => editIngredient(ingredient)}
                            key={ingredient._id}>
                            <span>{ingredient.name}</span>
                            <button
                                onClick={() => deleteIngredient(ingredient._id)}
                                className="ml-2">
                                X
                            </button>
                        </li>
                    ))}
                </ul>

                <button
                    className="bg-blue-500 text-white rounded-md p-2 mt-12"
                    onClick={() =>
                        document
                            .querySelector('.createIngredients')
                            ?.classList.toggle('hidden')
                    }>
                    New Ingredient
                </button>
            </div>

            <CreateIngredient baseUrl={baseUrl} />

            {/* <div className="hidden editIngredients">
                <div className="p-10 border border-gray-300 rounded-md hidden createIngredients">
                    <h1>Edit Ingredient</h1>
                    <form
                        onSubmit={editIngredient}
                        className="[&_input]:border-2 [&_input]:border-gray-300 [&_input]:rounded-md [&_input]:p-2 [&_select]:border-2 [&_select]:border-gray-300 [&_select]:rounded-md [&_select]:p-2 [&_button]:bg-blue-500 [&_button]:text-white [&_button]:rounded-md [&_button]:p-2 [&_button]:hover:bg-blue-600">
                        <div>
                            <label htmlFor="name">Name:</label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={ingredient.name}
                                onChange={(e) =>
                                    setNewIngredient({
                                        ...ingredient,
                                        name: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label htmlFor="quantity">Quantity:</label>
                            <input
                                id="quantity"
                                type="number"
                                name="quantity"
                                placeholder="Quantity"
                                value={ingredient.quantity}
                                onChange={(e) =>
                                    setNewIngredient({
                                        ...ingredient,
                                        quantity: Number(e.target.value),
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label htmlFor="type">Type:</label>
                            <select
                                id="type"
                                name="type"
                                value={ingredient.type}
                                onChange={(e) =>
                                    setNewIngredient({
                                        ...ingredient,
                                        type: e.target.value,
                                    })
                                }>
                                <option value="wet">Wet</option>
                                <option value="dry">Dry</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="calories">Calories:</label>
                            <input
                                id="calories"
                                type="number"
                                name="calories"
                                placeholder="Calories"
                                value={ingredient.nutrition.calories}
                                onChange={(e) =>
                                    setNewIngredient({
                                        ...ingredient,
                                        nutrition: {
                                            ...ingredient.nutrition,
                                            calories: Number(e.target.value),
                                        },
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label htmlFor="protein">Protein:</label>
                            <input
                                id="protein"
                                type="number"
                                step="0.01  "
                                name="protein"
                                placeholder="Protein"
                                value={ingredient.nutrition.protein}
                                onChange={(e) =>
                                    setNewIngredient({
                                        ...ingredient,
                                        nutrition: {
                                            ...ingredient.nutrition,
                                            protein: Number(e.target.value),
                                        },
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label htmlFor="fat">Fat:</label>
                            <input
                                id="fat"
                                type="number"
                                step="0.01"
                                name="fat"
                                placeholder="Fat"
                                value={ingredient.nutrition.fat}
                                onChange={(e) =>
                                    setNewIngredient({
                                        ...ingredient,
                                        nutrition: {
                                            ...ingredient.nutrition,
                                            fat: Number(e.target.value),
                                        },
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label htmlFor="fiber">Fiber:</label>
                            <input
                                id="fiber"
                                type="number"
                                step="0.01"
                                name="fiber"
                                placeholder="Fiber"
                                value={ingredient.nutrition.carbs.fiber}
                                onChange={(e) =>
                                    setNewIngredient({
                                        ...ingredient,
                                        nutrition: {
                                            ...ingredient.nutrition,
                                            carbs: {
                                                ...ingredient.nutrition.carbs,
                                                fiber: Number(e.target.value),
                                            },
                                        },
                                    })
                                }
                            />
                        </div>

                        <div>
                            <label htmlFor="sugar">Sugar:</label>
                            <input
                                id="sugar"
                                type="number"
                                step="0.01"
                                name="sugar"
                                placeholder="Sugar"
                                value={ingredient.nutrition.carbs.sugar}
                                onChange={(e) =>
                                    setNewIngredient({
                                        ...ingredient,
                                        nutrition: {
                                            ...ingredient.nutrition,
                                            carbs: {
                                                ...ingredient.nutrition.carbs,
                                                sugar: Number(e.target.value),
                                            },
                                        },
                                    })
                                }
                            />
                        </div>

                        <div>
                            <label htmlFor="totalCarbs">Total Carbs:</label>
                            <input
                                id="totalCarbs"
                                type="number"
                                step="0.01"
                                name="totalCarbs"
                                placeholder="Total Carbs"
                                value={ingredient.nutrition.carbs.totalCarbs}
                                onChange={(e) =>
                                    setNewIngredient({
                                        ...ingredient,
                                        nutrition: {
                                            ...ingredient.nutrition,
                                            carbs: {
                                                ...ingredient.nutrition.carbs,
                                                totalCarbs: Number(
                                                    e.target.value
                                                ),
                                            },
                                        },
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label htmlFor="price">Price:</label>
                            <input
                                id="price"
                                type="number"
                                step="0.01"
                                name="price"
                                placeholder="Price"
                                value={ingredient.price}
                                onChange={(e) =>
                                    setNewIngredient({
                                        ...ingredient,
                                        price: Number(e.target.value),
                                    })
                                }
                            />
                        </div>

                        <button type="submit">Create</button>
                    </form>
                </div>
            </div> */}
        </>
    )
}

export default Ingredients
