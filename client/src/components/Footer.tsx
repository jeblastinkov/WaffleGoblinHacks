import { Link } from "wouter";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import goblinLogo from "@assets/18TxLX8S_400x400.jpg";

export default function Footer() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // In a real app, this would connect to an API endpoint
    toast({
      title: "Subscription successful!",
      description: "You'll now receive daily lifehacks in your inbox."
    });
    
    setEmail("");
  };

  return (
    <footer className="bg-[#3E2844] text-white py-8 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <Link href="/">
            <a className="flex items-center gap-2 mb-4 md:mb-0">
              <img 
                src={goblinLogo} 
                alt="Waffle Goblin Logo" 
                className="w-10 h-10 pixelated"
              />
              <h2 className="font-pixel text-[#5AE053] text-lg">Waffle Goblin</h2>
            </a>
          </Link>
          
          <div className="flex gap-4">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#5AE053] transition-colors">
              <i className="ri-twitter-fill text-xl"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#5AE053] transition-colors">
              <i className="ri-instagram-fill text-xl"></i>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#5AE053] transition-colors">
              <i className="ri-facebook-fill text-xl"></i>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#5AE053] transition-colors">
              <i className="ri-youtube-fill text-xl"></i>
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between">
          <nav className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6 md:mb-0">
            <div>
              <h3 className="font-pixel text-[#5AE053] text-sm mb-3">Navigation</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/"><a className="hover:text-[#5AE053] transition-colors">Home</a></Link></li>
                <li><Link href="/archive"><a className="hover:text-[#5AE053] transition-colors">Archive</a></Link></li>
                <li><Link href="/favorites"><a className="hover:text-[#5AE053] transition-colors">My Favorites</a></Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-pixel text-[#5AE053] text-sm mb-3">Categories</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/category/1"><a className="hover:text-[#5AE053] transition-colors">Kitchen</a></Link></li>
                <li><Link href="/category/2"><a className="hover:text-[#5AE053] transition-colors">Home</a></Link></li>
                <li><Link href="/category/3"><a className="hover:text-[#5AE053] transition-colors">Tech</a></Link></li>
                <li><Link href="/category/4"><a className="hover:text-[#5AE053] transition-colors">Garden</a></Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-pixel text-[#5AE053] text-sm mb-3">About</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-[#5AE053] transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-[#5AE053] transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-[#5AE053] transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-[#5AE053] transition-colors">Terms</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-pixel text-[#5AE053] text-sm mb-3">Subscribe</h3>
              <p className="text-sm mb-3">Get daily lifehacks in your inbox!</p>
              <form className="flex" onSubmit={handleSubscribe}>
                <Input
                  type="email"
                  placeholder="Your email"
                  className="text-sm rounded-r-none w-full bg-[#3E2844] border border-gray-600 focus:outline-none focus:border-[#5AE053]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button 
                  type="submit"
                  className="bg-[#5AE053] px-3 py-2 rounded-l-none font-pixel text-xs h-auto"
                >
                  Go
                </Button>
              </form>
            </div>
          </nav>
        </div>
        
        <div className="text-center text-sm mt-8 pt-6 border-t border-gray-700">
          <p>© {new Date().getFullYear()} Waffle Goblin Lifehacks. All rights reserved.</p>
          <p className="mt-2 text-gray-400">Powered by OpenAI GPT-4o.</p>
        </div>
      </div>
    </footer>
  );
}
