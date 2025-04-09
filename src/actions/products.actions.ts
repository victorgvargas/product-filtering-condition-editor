import { datastore } from "@/data/datastore";
import { Operator, Product, Property } from "@/types/products";

export async function getProducts(): Promise<Product[]> {
  return datastore.getProducts();
}

export async function getProperties(): Promise<Property[]> {
  return datastore.getProperties();
}

export async function getOperators(): Promise<Operator[]> {
  return datastore.getOperators();
}