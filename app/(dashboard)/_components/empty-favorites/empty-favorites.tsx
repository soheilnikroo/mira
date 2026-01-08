import Image from 'next/image';

const EmptyFavorites = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image
        src="/empty-favorites.svg"
        alt="Empty Favorites"
        width={140}
        height={140}
      />
      <h2 className="text-2xl font-semibold mt-6">No favorite boards found</h2>
      <p className="text-sm text-muted-foreground mt-2">
        Add boards to your favorites to see them here
      </p>
    </div>
  );
};

export default EmptyFavorites;
