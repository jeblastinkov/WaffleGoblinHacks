import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { LifehackModel, CategoryModel } from "@shared/schema";
import SocialShare from "@/components/SocialShare";
import { saveFavorite, removeFavorite, isFavorited } from "@/lib/storage";

export default function Archive() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [favoriteStates, setFavoriteStates] = useState<Record<number, boolean>>({});
  const [shareModal, setShareModal] = useState<{ isOpen: boolean, lifehack: LifehackModel | null }>({
    isOpen: false,
    lifehack: null
  });

  const { data: lifehacks, isLoading: lifehacksLoading } = useQuery<LifehackModel[]>({
    queryKey: ['/api/lifehacks/all'],
    onSuccess: (data) => {
      const states: Record<number, boolean> = {};
      data.forEach(lifehack => {
        states[lifehack.id] = isFavorited(lifehack.id);
      });
      setFavoriteStates(states);
    }
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery<CategoryModel[]>({
    queryKey: ['/api/categories'],
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

  // Filter lifehacks based on category and search
  const filteredLifehacks = lifehacks?.filter(lifehack => {
    const matchesCategory = selectedCategory === null || lifehack.categoryId === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      lifehack.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lifehack.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  }) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-pixel text-2xl text-[#3E2844] mb-8">LIFEHACKS ARCHIVE</h1>
      
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block font-pixel text-xs text-[#3E2844] mb-2">Search</label>
            <input
              type="text"
              placeholder="Search lifehacks..."
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5AE053]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="md:w-1/3">
            <label className="block font-pixel text-xs text-[#3E2844] mb-2">Filter by Category</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5AE053]"
              value={selectedCategory === null ? "" : selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value === "" ? null : Number(e.target.value))}
            >
              <option value="">All Categories</option>
              {categories?.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
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
      ) : filteredLifehacks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="font-pixel text-lg text-[#3E2844] mb-4">No Lifehacks Found</h2>
          <p className="text-gray-600 mb-4">Try different search terms or filters.</p>
          <button 
            className="font-pixel text-[#5AE053] hover:underline"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory(null);
            }}
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLifehacks.map(lifehack => (
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
