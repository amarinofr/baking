package handlers

import (
	"context"

	"github.com/amarinofr/baking-app/models"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var collection *mongo.Collection

func InitCollection(c *mongo.Collection) {
	collection = c
}

func CreateIngredient(c *fiber.Ctx) error {
	ingredient := new(models.Ingredient)

	if err := c.BodyParser(ingredient); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
			"details": err.Error(),
		})
	}

	if ingredient.Name == "" {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"error": "Name is required",
		})
	}

	if ingredient.Type == "" {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"error": "At least one ingredient type (dry or wet) must be specified",
		})
	}

	if ingredient.Quantity < 0 {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"error": "Quantity cannot be negative",
		})
	}

	if ingredient.Price < 0 {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"error": "Price cannot be negative",
		})
	}

	if ingredient.Nutrition.Calories < 0 ||
		ingredient.Nutrition.Protein < 0 ||
		ingredient.Nutrition.Fat < 0 ||
		ingredient.Nutrition.Carbs.NetCarbs < 0 ||
		ingredient.Nutrition.Carbs.TotalCarbs < 0 {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"error": "Nutritional values cannot be negative",
		})
	}

	if ingredient.Nutrition.Carbs.TotalCarbs < ingredient.Nutrition.Carbs.NetCarbs {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"error": "Total carbs must be greater than or equal to net carbs",
		})
	}

	insertResult, err := collection.InsertOne(context.Background(), ingredient)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create ingredient",
		})
	}

	ingredient.ID = insertResult.InsertedID.(primitive.ObjectID)

	return c.Status(fiber.StatusCreated).JSON(ingredient)
}

func GetIngredients(c *fiber.Ctx) error {
	var ingredients []models.Ingredient

	cursor,err := collection.Find(context.Background(), bson.M{})

	if err != nil {
		return err
	}

	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var ingredient models.Ingredient

		if err := cursor.Decode(&ingredient); err != nil {
			return err
		}
		
		ingredients = append(ingredients, ingredient)
	}

	return c.JSON(ingredients)
}


func UpdateIngredient(c *fiber.Ctx) error {
	id := c.Params("id")
	objectID, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid Ingredient ID format",
		})
	}

	filter := bson.M{"_id": objectID}
	update := bson.M{"$set":bson.M{"completed":true}}

	_, err = collection.UpdateOne(context.Background(),filter,update)
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
	})
}

func DeleteIngredient(c *fiber.Ctx) error {
	id := c.Params("id")
	objectID, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid Ingredient ID format",
		})
	}

	filter := bson.M{"_id": objectID}
	
	_,err = collection.DeleteOne(context.Background(),filter)

	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
	})
}