import { useState } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { LifehackModel, CategoryModel } from "@shared/schema";
import SocialShare from "@/components/SocialShare";
import { saveFavorite, removeFavorite, isFavorited } from "@/lib/storage";

export default function CategoryView() {
  const [, params] = useRoute("/category/:categoryId");
  const categoryId = parseInt(params?.categoryId || "0");
  
  const [favoriteStates, setFavoriteStates] = useState<Record<number, boolean>>({});
  const [shareModal, setShareModal] = useState<{ isOpen: boolean, lifehack: LifehackModel | null }>({
    isOpen: false,
    lifehack: null
  });

  const { data: category, isLoading: categoryLoading } = useQuery<CategoryModel>({
    queryKey: [`/api/categories/${categoryId}`],
  });

  const { data: lifehacks, isLoading: lifehacksLoading } = useQuery<LifehackModel[]>({
    queryKey: [`/api/lifehacks/category/${categoryId}`],
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
    <div className="container mx-auto px-4 py-8">
      {categoryLoading ? (
        <div className="h-10 w-1/3 bg-gray-200 rounded animate-pulse mb-8"></div>
      ) : (
        <div className="flex items-center gap-3 mb-8">
          <i className={`${category?.icon} text-3xl`} style={{ color: category?.color }}></i>
          <h1 className="font-pixel text-2xl text-[#3E2844]">{category?.name} LIFEHACKS</h1>
        </div>
      )}
      
      {lifehacksLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden h-40 animate-pulse">
              <div className="bg-gray-200 h-8 w-full"></div>
              <div className="p-4 h-full">
                <div className="bg-gray-200 h-4 w-3/4 mb-2"></div>
                <div className="bg-gray-200 h-4 w-full mb-2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : lifehacks?.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="font-pixel text-lg text-[#3E2844] mb-4">No Lifehacks Found</h2>
          <p className="text-gray-600 mb-4">There are no lifehacks in this category yet.</p>
          <a href="/" className="font-pixel text-[#5AE053] hover:underline">Go back home</a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lifehacks?.map(lifehack => (
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
    </div>
  );
}
