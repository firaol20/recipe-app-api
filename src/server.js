// server.js
import express from "express";
import { ENV } from "./config/env.js";
import { db } from "./config/db.js";
import { favoritesTable } from "./db/schema.js";
import { eq, and } from "drizzle-orm";

const app = express();
app.use(express.json());

const PORT = ENV.PORT;

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true });
});

// Add favorite
app.post("/api/favorites", async (req, res) => {
  try {
    const { userId, recipeId, title, image, cookTime, servings } = req.body;

    if (!userId || !recipeId || !title) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newFavorite = await db
      .insert(favoritesTable)
      .values({ userId, recipeId, title, image, cookTime, servings })
      .returning({
        id: true,
        userId: true,
        recipeId: true,
        title: true,
        image: true,
        cookTime: true,
        servings: true,
      });

    res.status(201).json(newFavorite[0]);
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Get favorites for a user
app.get("/api/favorites/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const userFavorites = await db
      .select()
      .from(favoritesTable)
      .where(eq(favoritesTable.userId, userId));
    res.status(200).json(userFavorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Delete favorite
app.delete("/api/favorites/:userId/:recipeId", async (req, res) => {
  try {
    const { userId, recipeId } = req.params;

    await db
      .delete(favoritesTable)
      .where(
        and(
          eq(favoritesTable.userId, userId),
          eq(favoritesTable.recipeId, recipeId)
        )
      );

    res.status(200).json({ message: "Favorite removed successfully" });
  } catch (error) {
    console.error("Error removing a favorite:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
