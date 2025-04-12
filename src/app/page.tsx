import ProductsTable from "@/components/ProductsTable";
import {
  getOperators,
  getProducts,
  getProperties,
} from "@/actions/products.actions";

export default async function Home() {
  const products = await getProducts();
  const properties = await getProperties();
  const operators = await getOperators();

  return (
    <ProductsTable
      products={products}
      properties={properties}
      operators={operators}
    />
  );
}
