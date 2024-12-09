import type { Schema } from "../../data/resource"

export const handler: Schema["processCSV"]["functionHandler"] = async (event) => {
  // arguments typed from `.arguments()`
  const { name } = event.arguments
  // return typed from `.returns()`
  console.log("Hello, $(name)!")
  return `Hello, ${name}!`
}