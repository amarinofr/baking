package handlers

import (
	"context"

	"github.com/amarinofr/baking-app/models"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var mixCollection *mongo.Collection

func InitMixCollection(m *mongo.Collection) {
	mixCollection = m
}

func CreateMix(c *fiber.Ctx) error {
	mix := new(models.Mix)

	if err := c.BodyParser(mix); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
			"details": err.Error(),
		})
	}

	if mix.Name == "" {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"error": "Name is required",
		})
	}

	if mix.MixType == "" {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"error": "Mix type is required",
		})
	}

	if mix.Ingredients == nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"error": "Ingredients cannot be empty",
		})
	}

	// if mix.Recipes == nil {
	// 	return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
	// 		"error": "Recipes cannot be empty",
	// 	})
	// }

	insertResult, err := mixCollection.InsertOne(context.Background(), mix)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create mix",
		})
	}

	mix.ID = insertResult.InsertedID.(primitive.ObjectID)

	return c.Status(fiber.StatusCreated).JSON(mix)
}

func GetMixes(c *fiber.Ctx) error {
	var mixes []models.Mix

	cursor,err := mixCollection.Find(context.Background(), bson.M{})

	if err != nil {
		return err
	}

	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var mix models.Mix

		if err := cursor.Decode(&mix); err != nil {
			return err
		}
		
		mixes = append(mixes, mix)
	}

	return c.JSON(mixes)
}


func UpdateMix(c *fiber.Ctx) error {
	id := c.Params("id")
	objectID, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid Mix ID format",
		})
	}

	filter := bson.M{"_id": objectID}
	update := bson.M{"$set":bson.M{"completed":true}}

	_, err = mixCollection.UpdateOne(context.Background(),filter,update)
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
	})
}

func DeleteMix(c *fiber.Ctx) error {
	id := c.Params("id")
	objectID, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid Mix ID format",
		})
	}

	filter := bson.M{"_id": objectID}
	
	_,err = mixCollection.DeleteOne(context.Background(),filter)

	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
	})
}