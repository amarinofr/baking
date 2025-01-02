import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Ingredients } from './Ingredients'

const EditIngredient = ({ baseUrl }: { baseUrl: string }) => {
    const queryClient = useQueryClient()
    const [editedIngredient, setEditedIngredient] = useState<Ingredients>({
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

    const { mutate: updateIngredient, isPending: isEditing } = useMutation({
        mutationKey: ['edit-ingredient'],
        mutationFn: async (ingredient: Ingredients) => {
            document
                .querySelector('.editIngredients')
                ?.classList.toggle('hidden')
            try {
                const res = await fetch(
                    baseUrl + 'ingredients/' + ingredient._id,
                    {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(ingredient),
                    }
                )
                const data = await res.json()

                if (!res.ok) {
                    throw new Error(data.error || 'Failed to edit ingredient')
                }

                return data
            } catch (error: any) {
                throw new Error(error as string)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ingredients'] })
        },
    })

    return (
        <div className="p-10 border border-gray-300 rounded-md hidden editIngredients">
            <h1>Edit Ingredient</h1>
            <form
                onSubmit={updateIngredient}
                className="[&_input]:border-2 [&_input]:border-gray-300 [&_input]:rounded-md [&_input]:p-2 [&_select]:border-2 [&_select]:border-gray-300 [&_select]:rounded-md [&_select]:p-2 [&_button]:bg-blue-500 [&_button]:text-white [&_button]:rounded-md [&_button]:p-2 [&_button]:hover:bg-blue-600">
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={editedIngredient.name}
                        onChange={(e) =>
                            setEditedIngredient({
                                ...editedIngredient,
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
                        value={editedIngredient.quantity}
                        onChange={(e) =>
                            setEditedIngredient({
                                ...editedIngredient,
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
                        value={editedIngredient.type}
                        onChange={(e) =>
                            setEditedIngredient({
                                ...editedIngredient,
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
                        value={editedIngredient.nutrition.calories}
                        onChange={(e) =>
                            setEditedIngredient({
                                ...editedIngredient,
                                nutrition: {
                                    ...editedIngredient.nutrition,
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
                        value={editedIngredient.nutrition.protein}
                        onChange={(e) =>
                            setEditedIngredient({
                                ...editedIngredient,
                                nutrition: {
                                    ...editedIngredient.nutrition,
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
                        value={editedIngredient.nutrition.fat}
                        onChange={(e) =>
                            setEditedIngredient({
                                ...editedIngredient,
                                nutrition: {
                                    ...editedIngredient.nutrition,
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
                        value={editedIngredient.nutrition.carbs.fiber}
                        onChange={(e) =>
                            setEditedIngredient({
                                ...editedIngredient,
                                nutrition: {
                                    ...editedIngredient.nutrition,
                                    carbs: {
                                        ...editedIngredient.nutrition.carbs,
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
                        value={editedIngredient.nutrition.carbs.sugar}
                        onChange={(e) =>
                            setEditedIngredient({
                                ...editedIngredient,
                                nutrition: {
                                    ...editedIngredient.nutrition,
                                    carbs: {
                                        ...editedIngredient.nutrition.carbs,
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
                        value={editedIngredient.nutrition.carbs.totalCarbs}
                        onChange={(e) =>
                            setEditedIngredient({
                                ...editedIngredient,
                                nutrition: {
                                    ...editedIngredient.nutrition,
                                    carbs: {
                                        ...editedIngredient.nutrition.carbs,
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
                        value={editedIngredient.price}
                        onChange={(e) =>
                            setEditedIngredient({
                                ...editedIngredient,
                                price: Number(e.target.value),
                            })
                        }
                    />
                </div>

                <button type="submit">Update</button>
            </form>
        </div>
    )
}

export default EditIngredient
