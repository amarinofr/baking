package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Ingredient struct {
	ID       primitive.ObjectID  `json:"_id,omitempty" bson:"_id,omitempty"`
	Name     string  `json:"name"`
	Unit     string  `json:"unit"`
	Quantity int     `json:"quantity"`
	Price    float64 `json:"price"`
	Type     string  `json:"type"`
	Nutrition Nutrition `json:"nutrition"`
}

type Nutrition struct {
	Calories int `json:"calories"`
	Protein  int `json:"protein"`
	Fat      int `json:"fat"`
	Carbs    Carbs `json:"carbs"`
}

type Carbs struct {
	NetCarbs int `json:"netCarbs"`
	TotalCarbs int `json:"totalCarbs"`
}