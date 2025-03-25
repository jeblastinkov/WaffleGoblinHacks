import { Link } from "wouter";
import goblinLogo from "@assets/18TxLX8S_400x400.jpg";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="bg-white shadow-md px-4 py-3 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <a className="flex items-center gap-2">
            <img 
              src={goblinLogo} 
              alt="Waffle Goblin Logo" 
              className="w-12 h-12 pixelated"
            />
            <h1 className="font-pixel text-[#5AE053] text-xl hidden sm:block">Waffle Goblin</h1>
          </a>
        </Link>
        
        <div className="flex gap-4">
          <Link href="/favorites">
            <Button className="pixel-button bg-[#5AE053] px-4 py-2 rounded-lg text-white font-pixel text-xs shadow-md hover:bg-[#4AD043]">
              My Favorites
            </Button>
          </Link>
          <Link href="/archive">
            <Button className="pixel-button bg-[#8A2B43] px-4 py-2 rounded-lg text-white font-pixel text-xs shadow-md hover:bg-[#7A1B33]">
              Archive
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
