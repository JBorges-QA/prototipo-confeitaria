import { EditProductView } from "@/components/admin/edit-product-view";

export const metadata = { title: "Editar produto" };

export default async function EditProductPage(props: PageProps<"/admin/produtos/[id]">) {
  const { id } = await props.params;
  return <EditProductView id={id} />;
}
