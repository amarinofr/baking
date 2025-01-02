import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

const CreateIngredient = ({ baseUrl }: { baseUrl: string }) => {
    const queryClient = useQueryClient()
    const [newIngredient, setNewIngredient] = useState<Ingredients>({
        _id: '',
        name: '',
        type: '',
        quantity: 0,
        unit: 'grams',
        nutrition: {
            calories: 0,
            protein: 0,
            fat: 0,
            carbs: {
                fiber: 0,
                sugar: 0,
                totalCarbs: 0,
            },
        },
        price: 0,
    })

    const { mutate: createIngredient, isPending: isCreating } = useMutation({
        mutationKey: ['create-ingredient'],
        mutationFn: async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            try {
                const res = await fetch(baseUrl + 'ingredients', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newIngredient),
                })
                const data = await res.json()

                if (!res.ok) {
                    throw new Error(data.error || 'Failed to create ingredient')
                }

                setNewIngredient({
                    _id: '',
                    name: '',
                    type: '',
                    quantity: 0,
                    unit: 'grams',
                    nutrition: {
                        calories: 0,
                        protein: 0,
                        fat: 0,
                        carbs: {
                            fiber: 0,
                            sugar: 0,
                            totalCarbs: 0,
                        },
                    },
                    price: 0,
                })

                return data
            } catch (error: any) {
                throw new Error(error as string)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ingredients'] })
        },
        onError: (error: any) => {
            console.error(error.message)
        },
    })

    return (
        <div className="p-10 border border-gray-300 rounded-md hidden createIngredients">
            <h1>Create Ingredient</h1>
            <form
                onSubmit={createIngredient}
                className="[&_input]:border-2 [&_input]:border-gray-300 [&_input]:rounded-md [&_input]:p-2 [&_select]:border-2 [&_select]:border-gray-300 [&_select]:rounded-md [&_select]:p-2 [&_button]:bg-blue-500 [&_button]:text-white [&_button]:rounded-md [&_button]:p-2 [&_button]:hover:bg-blue-600">
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={newIngredient.name}
                        onChange={(e) =>
                            setNewIngredient({
                                ...newIngredient,
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
                        value={newIngredient.quantity}
                        onChange={(e) =>
                            setNewIngredient({
                                ...newIngredient,
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
                        value={newIngredient.type}
                        onChange={(e) =>
                            setNewIngredient({
                                ...newIngredient,
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
                        value={newIngredient.nutrition.calories}
                        onChange={(e) =>
                            setNewIngredient({
                                ...newIngredient,
                                nutrition: {
                                    ...newIngredient.nutrition,
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
                        value={newIngredient.nutrition.protein}
                        onChange={(e) =>
                            setNewIngredient({
                                ...newIngredient,
                                nutrition: {
                                    ...newIngredient.nutrition,
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
                        value={newIngredient.nutrition.fat}
                        onChange={(e) =>
                            setNewIngredient({
                                ...newIngredient,
                                nutrition: {
                                    ...newIngredient.nutrition,
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
                        value={newIngredient.nutrition.carbs.fiber}
                        onChange={(e) =>
                            setNewIngredient({
                                ...newIngredient,
                                nutrition: {
                                    ...newIngredient.nutrition,
                                    carbs: {
                                        ...newIngredient.nutrition.carbs,
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
                        value={newIngredient.nutrition.carbs.sugar}
                        onChange={(e) =>
                            setNewIngredient({
                                ...newIngredient,
                                nutrition: {
                                    ...newIngredient.nutrition,
                                    carbs: {
                                        ...newIngredient.nutrition.carbs,
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
                        value={newIngredient.nutrition.carbs.totalCarbs}
                        onChange={(e) =>
                            setNewIngredient({
                                ...newIngredient,
                                nutrition: {
                                    ...newIngredient.nutrition,
                                    carbs: {
                                        ...newIngredient.nutrition.carbs,
                                        totalCarbs: Number(e.target.value),
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
                        value={newIngredient.price}
                        onChange={(e) =>
                            setNewIngredient({
                                ...newIngredient,
                                price: Number(e.target.value),
                            })
                        }
                    />
                </div>

                <button type="submit">Create</button>
            </form>
        </div>
    )
}

export default CreateIngredient
