// db/schema.js
import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

export const favoritesTable = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  recipeId: integer("recipe_id").notNull(),
  title: text("title"),
  image: text("image"),
  cookTime: text("cook_time"),
  servings: integer("servings"),
});
