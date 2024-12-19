package models

import "go.mongodb.org/mongo-driver/bson/primitive"

// Define ingredient types
type IngredientType string

const (
	WetIngredient IngredientType = "wet"
)

type Recipe struct {
	ID          primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Version     int                `json:"version" bson:"version"`
	Name        string             `json:"name"`
	Type        string             `json:"type"`
	Hydration   float64            `json:"hydration"`
	Ingredients []RecipeIngredient `json:"ingredients"`
	Mixes       []RecipeMix        `json:"mixes"`
	Totals      Totals             `json:"totals"`
}

type RecipeIngredient struct {
	ID       primitive.ObjectID `json:"_id" bson:"_id"`
	Quantity int               	`json:"quantity" bson:"quantity"`
	Unit     string            	`json:"unit" bson:"unit"`
	Type     IngredientType    	`json:"type" bson:"type"`
}

type RecipeMix struct {
	ID       primitive.ObjectID `json:"_id" bson:"_id"`
	Quantity int               	`json:"quantity" bson:"quantity"`
}

type Totals struct {
	TotalWeight 	int `json:"totalWeight"`
	TotalPrice  	float64 `json:"totalPrice"`
	TotalCalories float64 `json:"totalCalories"`
	TotalProtein  float64 `json:"totalProtein"`
	TotalFat      float64 `json:"totalFat"`
	TotalNetCarbs float64 `json:"totalNetCarbs"`
	TotalCarbs    float64 `json:"totalCarbs"`
}
