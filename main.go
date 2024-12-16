package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/amarinofr/baking-app/db"
	"github.com/amarinofr/baking-app/handlers"

	"github.com/gofiber/fiber/v2"
)

func main() {
	client := db.Connect()
	defer client.Disconnect(context.Background())

	err := client.Ping(context.Background(), nil)

	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("DB connected")

	database := client.Database("baking-app")
	
	// Initialize the Ingredients collection
	ingredientCollection := database.Collection("ingredients")
	handlers.InitCollection(ingredientCollection)

	// Initialize the Recipes collection
	recipeCollection := database.Collection("recipes")
	handlers.InitRecipeCollection(recipeCollection)

	// Initialize the Mixes collection
	mixCollection := database.Collection("mixes")
	handlers.InitMixCollection(mixCollection)

	app := fiber.New()

	app.Get("/api/ingredients", handlers.GetIngredients)
	app.Post("/api/ingredients", handlers.CreateIngredient)
	app.Patch("/api/ingredients/:id", handlers.UpdateIngredient)
	app.Delete("/api/ingredients/:id", handlers.DeleteIngredient)

	app.Get("/api/recipes", handlers.GetRecipes)
	app.Post("/api/recipes", handlers.CreateRecipe)
	app.Patch("/api/recipes/:id", handlers.UpdateRecipe)
	app.Delete("/api/recipes/:id", handlers.DeleteRecipe)

	app.Get("/api/mixes", handlers.GetMixes)
	app.Post("/api/mixes", handlers.CreateMix)
	app.Patch("/api/mixes/:id", handlers.UpdateMix)
	app.Delete("/api/mixes/:id", handlers.DeleteMix)

	port := os.Getenv("PORT")

	if port == "" {
		port = "3000"
	}

	log.Fatal(app.Listen("0.0.0.0:" + port))
}


