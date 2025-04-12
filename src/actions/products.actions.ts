import { datastore } from "@/data/datastore";
import { Operator, Product, Property } from "@/types/products";

export async function getProducts(): Promise<Product[]> {
  return await datastore.getProducts();
}

export async function getProperties(): Promise<Property[]> {
  return await datastore.getProperties();
}

export async function getOperators(): Promise<Operator[]> {
  return await datastore.getOperators();
}
