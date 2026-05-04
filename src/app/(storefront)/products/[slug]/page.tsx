import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "./product-detail-client";

type Props = { params: Promise<{ slug: string }> };

async function fetchProduct(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? "https://api.appilico.com/api/v1"}/products/${slug}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const imageUrl = product.primaryImageUrl ?? product.images?.[0]?.imageUrl;

  return {
    title: product.name,
    description: product.description?.slice(0, 160) ?? product.name,
    openGraph: {
      title: product.name,
      description: product.description?.slice(0, 160) ?? product.name,
      images: imageUrl ? [{ url: imageUrl, alt: product.name }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description?.slice(0, 160) ?? product.name,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  return <ProductDetailClient slug={slug} />;
}
