import { getPhotoBySlug } from "@/lib/photos";

export default async function PhotoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const photo = getPhotoBySlug(slug);

  if (!photo) return <div>Photo not found</div>;

  return (
    <div>
      <h1>{photo.title}</h1>
      <img src={photo.image} alt={photo.title} />
    </div>
  );
}
