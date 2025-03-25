import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { LifehackModel } from "@shared/schema";
import SocialShare from "@/components/SocialShare";
import { removeFavorite, getFavorites } from "@/lib/storage";

export default function Favorites() {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [shareModal, setShareModal] = useState<{ isOpen: boolean, lifehack: LifehackModel | null }>({
    isOpen: false,
    lifehack: null
  });

  useEffect(() => {
    // Load favorite IDs from local storage
    setFavoriteIds(getFavorites());
  }, []);

  const { data: allLifehacks, isLoading } = useQuery<LifehackModel[]>({
    queryKey: ['/api/lifehacks/all'],
  });

  // Filter lifehacks to only show favorites
  const favoriteLifehacks = allLifehacks?.filter(lifehack => 
    favoriteIds.includes(lifehack.id)
  ) || [];

  const handleRemoveFavorite = (lifehackId: number) => {
    removeFavorite(lifehackId);
    setFavoriteIds(prev => prev.filter(id => id !== lifehackId));
  };

  const openShareModal = (lifehack: LifehackModel) => {
    setShareModal({
      isOpen: true,
      lifehack
    });
  };

  const closeShareModal = () => {
    setShareModal({
      isOpen: false,
      lifehack: null
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-pixel text-2xl text-[#3E2844] mb-8">MY FAVORITE LIFEHACKS</h1>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden h-40 animate-pulse">
              <div className="bg-gray-200 h-8 w-full"></div>
              <div className="p-4 h-full">
                <div className="bg-gray-200 h-4 w-3/4 mb-2"></div>
                <div className="bg-gray-200 h-4 w-full mb-2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : favoriteLifehacks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="font-pixel text-lg text-[#3E2844] mb-4">No Favorites Yet</h2>
          <p className="text-gray-600 mb-4">You haven't saved any lifehacks to your favorites yet.</p>
          <a href="/" className="font-pixel text-[#5AE053] hover:underline">Go back home</a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteLifehacks.map(lifehack => (
            <div key={lifehack.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-[#FFC0CB] px-4 py-2">
                <p className="font-pixel text-xs text-[#3E2844]">
                  {format(new Date(lifehack.date), 'MMMM d, yyyy')}
                </p>
              </div>
              <div className="p-4">
                <p className="font-body mb-4">{lifehack.content}</p>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <button 
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleRemoveFavorite(lifehack.id)}
                      title="Remove from favorites"
                    >
                      <i className="ri-heart-fill"></i>
                    </button>
                    <button 
                      className="text-[#5AE053] hover:text-green-600"
                      onClick={() => openShareModal(lifehack)}
                      title="Share lifehack"
                    >
                      <i className="ri-share-line"></i>
                    </button>
                  </div>
                  <span className="text-xs text-[#3E2844] opacity-70">
                    {lifehack.tags.map(tag => `#${tag}`).join(' ')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {shareModal.isOpen && shareModal.lifehack && (
        <SocialShare 
          isOpen={shareModal.isOpen} 
          onClose={closeShareModal} 
          lifehack={shareModal.lifehack}
        />
      )}
    </div>
  );
}
