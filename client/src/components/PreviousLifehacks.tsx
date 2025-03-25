import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Link } from "wouter";
import { LifehackModel } from "@shared/schema";
import SocialShare from "@/components/SocialShare";
import { saveFavorite, removeFavorite, isFavorited } from "@/lib/storage";

export default function PreviousLifehacks({ limit = 3 }: { limit?: number }) {
  const [shareModal, setShareModal] = useState<{ isOpen: boolean, lifehack: LifehackModel | null }>({
    isOpen: false,
    lifehack: null
  });
  
  const [favoriteStates, setFavoriteStates] = useState<Record<number, boolean>>({});

  const { data: lifehacks, isLoading } = useQuery<LifehackModel[]>({
    queryKey: ['/api/lifehacks/previous'],
    onSuccess: (data) => {
      const states: Record<number, boolean> = {};
      data.forEach(lifehack => {
        states[lifehack.id] = isFavorited(lifehack.id);
      });
      setFavoriteStates(states);
    }
  });

  const toggleFavorite = (lifehackId: number) => {
    if (favoriteStates[lifehackId]) {
      removeFavorite(lifehackId);
    } else {
      saveFavorite(lifehackId);
    }
    
    setFavoriteStates(prev => ({
      ...prev,
      [lifehackId]: !prev[lifehackId]
    }));
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
    <section className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-pixel text-xl text-[#3E2844]">PREVIOUS LIFEHACKS</h2>
        <Link href="/archive">
          <a className="font-pixel text-xs text-[#8A2B43] hover:underline">View All</a>
        </Link>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden h-40 animate-pulse">
              <div className="bg-gray-200 h-8 w-full"></div>
              <div className="p-4 h-full">
                <div className="bg-gray-200 h-4 w-3/4 mb-2"></div>
                <div className="bg-gray-200 h-4 w-full mb-2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lifehacks?.slice(0, limit).map(lifehack => (
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
                      className={`text-${favoriteStates[lifehack.id] ? 'red-600' : '[#8A2B43]'} hover:text-red-600`}
                      onClick={() => toggleFavorite(lifehack.id)}
                      title={favoriteStates[lifehack.id] ? "Remove from favorites" : "Save to favorites"}
                    >
                      <i className={`ri-heart-${favoriteStates[lifehack.id] ? 'fill' : 'line'}`}></i>
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
    </section>
  );
}
