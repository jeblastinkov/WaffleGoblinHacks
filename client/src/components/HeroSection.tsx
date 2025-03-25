import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import SocialShare from "@/components/SocialShare";
import goblinLogo from "@assets/18TxLX8S_400x400.jpg";
import { LifehackModel } from "@shared/schema";

export default function HeroSection() {
  const [showShareModal, setShowShareModal] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [rotationDeg, setRotationDeg] = useState(0);
  
  const { data: dailyLifehack, isLoading } = useQuery<LifehackModel>({
    queryKey: ['/api/lifehacks/today']
  });

  // Random rotation for the lifehack card on mount
  useEffect(() => {
    setRotationDeg(Math.random() * 6 - 3); // Random value between -3 and 3 degrees
  }, []);

  const handleGoblinClick = () => {
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 1000);
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
    <section className="container mx-auto px-4 py-8 relative">
      {/* Floating bubbles animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="animate-float absolute top-20 left-10 w-6 h-6 rounded-full bg-green-200 opacity-50"></div>
        <div className="animate-float-slow absolute top-40 right-20 w-10 h-10 rounded-full bg-blue-200 opacity-50"></div>
        <div className="animate-float-slower absolute bottom-20 left-1/4 w-8 h-8 rounded-full bg-purple-200 opacity-50"></div>
        <div className="animate-float-slowest absolute bottom-40 right-1/3 w-12 h-12 rounded-full bg-yellow-200 opacity-50"></div>
      </div>
      
      <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-lg mx-auto transform hover:scale-102 transition-transform duration-300" 
           style={{ transform: `rotate(${rotationDeg}deg)` }}>
        {/* Date display */}
        <div className="bg-[#5AE053] px-6 py-4">
          <p className="font-pixel text-white text-center text-lg">
            {currentDate}
          </p>
        </div>
        
        {/* Today's lifehack */}
        <div className="p-6">
          {/* Goblin Character */}
          <div className="flex justify-center mb-6">
            <div 
              className={`relative cursor-pointer transform transition-transform duration-300 ${isJumping ? 'animate-jump' : 'hover:scale-110'}`}
              onClick={handleGoblinClick}
            >
              <img 
                src={goblinLogo} 
                alt="Waffle Goblin Character" 
                className="w-32 h-32 pixelated"
              />
              <div className="absolute -bottom-2 -right-2 bg-[#5AE053] w-8 h-8 rounded-full flex items-center justify-center text-white font-bold animate-pulse">
                !
              </div>
            </div>
          </div>
          
          {/* Lifehack content */}
          <div className="text-center">
            <h2 className="font-pixel text-2xl text-[#3E2844] mb-4 animate-bounce-slow">TODAY'S LIFEHACK</h2>
            
            <div className="pixel-border p-5 rounded-lg bg-gradient-to-br from-yellow-50 to-green-50 shadow-inner">
              {isLoading ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mx-auto"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
                </div>
              ) : (
                <p className="font-body text-xl mb-6 leading-relaxed">
                  {dailyLifehack?.content || "No lifehack available for today. Check back soon!"}
                </p>
              )}
              
              <div className="flex justify-center items-center mt-4">
                <Button 
                  className="pixel-button bg-[#5AE053] text-white py-2 px-6 rounded-lg text-base font-pixel hover:bg-[#4AD043] hover:scale-105 transform transition-all duration-200"
                  onClick={openShareModal}
                >
                  <i className="ri-share-line mr-2"></i>
                  Share This Wisdom
                </Button>
              </div>
              
              <div className="mt-4 text-center">
                <span className="text-sm text-[#3E2844] font-medium">
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
          lifehack={dailyLifehack || null}
        />
      )}
    </section>
  );
}
