import { useState, useEffect } from "react";
import { Link } from "wouter";
import goblinLogo from "@assets/18TxLX8S_400x400.jpg";

export default function Header() {
  const [isWiggling, setIsWiggling] = useState(false);
  const [rotationDeg, setRotationDeg] = useState(0);

  useEffect(() => {
    // Random small rotation for playful effect
    setRotationDeg(Math.random() * 4 - 2); // Random value between -2 and 2 degrees
  }, []);

  const handleLogoClick = () => {
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 1000);
  };

  return (
    <header className="bg-gradient-to-r from-green-50 to-yellow-50 shadow-lg px-4 py-3 sticky top-0 z-10 border-b-2 border-[#5AE053]">
      <div className="container mx-auto flex justify-center items-center">
        <Link href="/">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div 
              className="relative" 
              onClick={handleLogoClick}
              style={{ transform: `rotate(${rotationDeg}deg)` }}
            >
              <img 
                src={goblinLogo} 
                alt="Waffle Goblin Logo" 
                className={`w-12 h-12 pixelated transition-transform duration-300 ease-in-out group-hover:scale-110 ${isWiggling ? 'animate-wiggle' : ''}`}
              />
              <div className="absolute -bottom-1 -right-1 bg-[#5AE053] w-5 h-5 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold animate-pulse">!</span>
              </div>
            </div>
            <div className="flex flex-col items-start">
              <h1 className="font-pixel text-[#3E2844] text-2xl group-hover:text-[#5AE053] transition-colors">
                <span className="inline-block hover:animate-bounce">W</span>
                <span className="inline-block hover:animate-bounce delay-75">a</span>
                <span className="inline-block hover:animate-bounce delay-100">f</span>
                <span className="inline-block hover:animate-bounce delay-150">f</span>
                <span className="inline-block hover:animate-bounce delay-200">l</span>
                <span className="inline-block hover:animate-bounce delay-300">e</span>
                <span className="inline-block hover:animate-bounce delay-500"> </span>
                <span className="inline-block hover:animate-bounce delay-400">G</span>
                <span className="inline-block hover:animate-bounce delay-450">o</span>
                <span className="inline-block hover:animate-bounce delay-500">b</span>
                <span className="inline-block hover:animate-bounce delay-550">l</span>
                <span className="inline-block hover:animate-bounce delay-600">i</span>
                <span className="inline-block hover:animate-bounce delay-650">n</span>
              </h1>
              <p className="text-xs text-[#3E2844] opacity-70">Daily lifehacks for your life!</p>
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
}
