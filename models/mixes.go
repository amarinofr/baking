package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Mix struct {
	ID          primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Version     int                `json:"version" bson:"version"`
	Name        string             `json:"name" bson:"name"`
	MixType     string            	`json:"mixType" bson:"mixType"`
	Ingredients []MixIngredient	`json:"ingredients" bson:"ingredients"`
}

type MixIngredient struct {
	ID       primitive.ObjectID `json:"_id" bson:"_id"`
	Quantity int               `json:"quantity" bson:"quantity"`
}