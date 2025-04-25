"use server"

import { connectToDatabase } from "@/lib/database"
import Category from "@/lib/database/models/category.model"
import { handleError } from "@/lib/utils"

export async function createCategory(name: string) {
  try {
    await connectToDatabase()

    const newCategory = await Category.create({ name })

    return JSON.parse(JSON.stringify(newCategory))
  } catch (error) {
    handleError(error)
  }
}

export async function getAllCategories() {
  try {
    await connectToDatabase()

    const categories = await Category.find()

    return JSON.parse(JSON.stringify(categories))
  } catch (error) {
    handleError(error)
  }
}