import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import SocialShare from "@/components/SocialShare";
import goblinLogo from "@assets/18TxLX8S_400x400.jpg";
import { saveFavorite, removeFavorite, isFavorited } from "@/lib/storage";
import { LifehackModel } from "@shared/schema";

export default function HeroSection() {
  const [showShareModal, setShowShareModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const { data: dailyLifehack, isLoading } = useQuery<LifehackModel>({
    queryKey: ['/api/lifehacks/today'],
    onSuccess: (data) => {
      setIsFavorite(isFavorited(data.id));
    }
  });

  const toggleFavorite = () => {
    if (!dailyLifehack) return;
    
    if (isFavorite) {
      removeFavorite(dailyLifehack.id);
    } else {
      saveFavorite(dailyLifehack.id);
    }
    
    setIsFavorite(!isFavorite);
  };

  const openShareModal = () => {
    setShowShareModal(true);
  };

  const closeShareModal = () => {
    setShowShareModal(false);
  };

  const currentDate = format(new Date(), 'MMMM d, yyyy');
  
  // Tags as a string with hashtags
  const tagsString = dailyLifehack?.tags ? dailyLifehack.tags.map(tag => `#${tag}`).join(' ') : '';

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
        {/* Date display */}
        <div className="bg-[#5AE053] px-6 py-3">
          <p className="font-pixel text-white text-center">
            {currentDate}
          </p>
        </div>
        
        {/* Today's lifehack */}
        <div className="p-6 flex flex-col md:flex-row gap-6 items-center">
          <div className="md:w-1/3 flex justify-center">
            <div className="relative">
              <img 
                src={goblinLogo} 
                alt="Waffle Goblin Character" 
                className="w-32 h-32 md:w-48 md:h-48 pixelated animate-bounce-slow"
              />
              {dailyLifehack?.image && (
                <img 
                  src={dailyLifehack.image} 
                  alt="Lifehack illustration" 
                  className="w-16 h-16 absolute -bottom-2 -right-2 rounded-lg pixelated"
                />
              )}
            </div>
          </div>
          
          <div className="md:w-2/3">
            <h2 className="font-pixel text-xl text-[#3E2844] mb-4">TODAY'S LIFEHACK</h2>
            <div className="pixel-border p-4 rounded-lg bg-[#F5F5DC]">
              {isLoading ? (
                <p className="font-body text-lg mb-4 animate-pulse">Loading today's brilliant lifehack...</p>
              ) : (
                <p className="font-body text-lg mb-4">
                  {dailyLifehack?.content || "No lifehack available for today. Check back soon!"}
                </p>
              )}
              
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button 
                    className={`pixel-button ${isFavorite ? 'bg-red-500' : 'bg-[#8A2B43]'} text-white p-2 rounded-lg`}
                    onClick={toggleFavorite}
                    title={isFavorite ? "Remove from favorites" : "Save to favorites"}
                  >
                    <i className={`ri-heart-${isFavorite ? 'fill' : 'line'}`}></i>
                  </Button>
                  <Button 
                    className="pixel-button bg-[#5AE053] text-white p-2 rounded-lg"
                    onClick={openShareModal}
                    title="Share on social media"
                  >
                    <i className="ri-share-line"></i>
                  </Button>
                </div>
                <span className="text-sm text-[#3E2844] opacity-70">
                  {tagsString}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showShareModal && (
        <SocialShare 
          isOpen={showShareModal} 
          onClose={closeShareModal} 
          lifehack={dailyLifehack}
        />
      )}
    </section>
  );
}
