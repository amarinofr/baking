package handlers

import (
	"context"

	"github.com/amarinofr/baking-app/models"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var recipeCollection *mongo.Collection

func InitRecipeCollection(r *mongo.Collection) {
	recipeCollection = r
}

func CreateRecipe(c *fiber.Ctx) error {
	recipe := new(models.Recipe)

	if err := c.BodyParser(recipe); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
			"details": err.Error(),
		})
	}

	if recipe.Name == "" {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"error": "Name is required",
		})
	}

	if recipe.Version == 0 {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"error": "Version is required",
		})
	}

	if recipe.Type == "" {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"error": "recipe type is required",
		})
	}

	if recipe.Hydration < 0 {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"error": "Hydration must be greater than 0",
		})
	}

	for _, mix := range recipe.Mixes {
		if mix.ID == primitive.NilObjectID ||
			mix.Quantity == 0 {
			return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
				"error": "Mix is required",
			})
		}
	}

	if recipe.Ingredients == nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"error": "Ingredients are required",
		})
	}

	for _, ingredient := range recipe.Ingredients {
		if ingredient.Type != models.WetIngredient {
			return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
				"error": "Only wet ingredients are allowed in recipes",
			})
		}
	}

	if recipe.Totals.TotalWeight < 0 ||
		recipe.Totals.TotalPrice < 0 ||
		recipe.Totals.TotalCalories < 0 ||
		recipe.Totals.TotalProtein < 0 ||
		recipe.Totals.TotalFat < 0 ||
		recipe.Totals.TotalNetCarbs < 0 ||
		recipe.Totals.TotalCarbs < 0 {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"error": "Totals cannot be negative",
		})
	}

	insertResult, err := recipeCollection.InsertOne(context.Background(), recipe)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create recipe",
		})
	}

	recipe.ID = insertResult.InsertedID.(primitive.ObjectID)

	return c.Status(fiber.StatusCreated).JSON(recipe)
}

func GetRecipes(c *fiber.Ctx) error {
	var recipes []models.Recipe

	cursor,err := recipeCollection.Find(context.Background(), bson.M{})

	if err != nil {
		return err
	}

	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var recipe models.Recipe

		if err := cursor.Decode(&recipe); err != nil {
			return err
		}
		
		recipes = append(recipes, recipe)
	}

	return c.JSON(recipes)
}


func UpdateRecipe(c *fiber.Ctx) error {
	id := c.Params("id")
	objectID, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid recipe ID format",
		})
	}

	filter := bson.M{"_id": objectID}
	update := bson.M{"$set":bson.M{"completed":true}}

	_, err = recipeCollection.UpdateOne(context.Background(),filter,update)
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
	})
}

func DeleteRecipe(c *fiber.Ctx) error {
	id := c.Params("id")
	objectID, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid recipe ID format",
		})
	}

	filter := bson.M{"_id": objectID}
	
	_,err = recipeCollection.DeleteOne(context.Background(),filter)

	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
	})
}