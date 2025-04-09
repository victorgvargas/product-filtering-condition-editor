import ProductsTable from "@/components/ProductsTable";
import { getProducts, getProperties } from "@/actions/products.actions";

export default async function Home() {
  const products = await getProducts();
  const properties = await getProperties();

  return (
    <ProductsTable products={products} properties={properties}/>
  );
}
