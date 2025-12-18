import EntityManagementPage from "@/components/EntityManagementPage";

const previewImages = [
  {
    id: 1,
    image: "/images/character-1.jpg",
    rotation: "-rotate-12",
    size: "h-40 w-32",
    z: "z-10",
    offset: "-mr-4",
  },
  {
    id: 2,
    image: "/images/character-2.jpg",
    rotation: "rotate-3",
    size: "h-52 w-40",
    z: "z-20",
    offset: "-mr-6",
  },
  {
    id: 3,
    image: "/images/character-3.jpg",
    rotation: "-rotate-6",
    size: "h-44 w-34",
    z: "z-30",
    offset: "-mr-3",
  },
  {
    id: 4,
    image: "/images/character-4.jpg",
    rotation: "rotate-10",
    size: "h-48 w-36",
    z: "z-20",
    offset: "",
  },
];

const galleryImages = [
  { id: 1, image: "/images/gallery-1.jpg" },
  { id: 2, image: "/images/gallery-2.jpg" },
  { id: 3, image: "/images/gallery-3.jpg" },
  { id: 4, image: "/images/gallery-4.jpg" },
  { id: 5, image: "/images/gallery-5.jpg" },
];

export default function CreateCharacter() {
  return (
    <EntityManagementPage
      entityType="character"
      title="MAKE YOUR OWN CHARACTER"
      subtitle="Upload some selfies. Generate photos and videos of yourself in any style."
      subtitle2="It learns your face and keeps it consistent across everything you make"
      buttonText="Create Character"
      buttonLoadingText="Creating..."
      deleteTitle="Delete Character"
      deleteMessage="Are you sure you want to delete this character? This action cannot be undone."
      generateUrlParam="characters"
      previewImages={previewImages}
      galleryImages={galleryImages}
    />
  );
}
