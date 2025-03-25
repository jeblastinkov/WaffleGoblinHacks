import { Link } from "wouter";
import goblinLogo from "@assets/18TxLX8S_400x400.jpg";

export default function Header() {
  return (
    <header className="bg-white shadow-md px-4 py-3 sticky top-0 z-10">
      <div className="container mx-auto flex justify-center items-center">
        <Link href="/">
          <div className="flex items-center gap-3 group">
            <div className="relative">
              <img 
                src={goblinLogo} 
                alt="Waffle Goblin Logo" 
                className="w-14 h-14 pixelated transition-transform duration-300 ease-in-out group-hover:scale-110"
              />
              <div className="absolute -bottom-1 -right-1 bg-[#5AE053] w-4 h-4 rounded-full animate-ping opacity-75 hidden group-hover:block"></div>
            </div>
            <h1 className="font-pixel text-[#5AE053] text-2xl group-hover:animate-bounce">Waffle Goblin</h1>
          </div>
        </Link>
      </div>
    </header>
  );
}
