package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Ingredient struct {
	ID       primitive.ObjectID  `json:"_id,omitempty" bson:"_id,omitempty"`
	Name     string  `json:"name"`
	Unit     string  `json:"unit"`
	Quantity int     `json:"quantity"`
	Price    float32 `json:"price"`
	Type     string  `json:"type"`
	Nutrition *Nutrition `json:"nutrition"`
}

type Nutrition struct {
	Calories int `json:"calories"`
	Protein  float32 `json:"protein"`
	Fat      float32 `json:"fat"`
	Carbs    *Carbs `json:"carbs"`
}

type Carbs struct {
	Fiber float32 `json:"fiber"`
	Sugar float32 `json:"sugar"`
	TotalCarbs float32 `json:"totalCarbs"`
}
