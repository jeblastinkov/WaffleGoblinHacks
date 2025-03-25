import { useRef, useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { LifehackModel } from "@shared/schema";
import goblinLogo from "@assets/18TxLX8S_400x400.jpg";

interface SocialShareProps {
  isOpen: boolean;
  onClose: () => void;
  lifehack: LifehackModel | null;
}

export default function SocialShare({ isOpen, onClose, lifehack }: SocialShareProps) {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isBouncingGoblin, setIsBouncingGoblin] = useState(false);
  
  // Generate a sharable URL
  const shareUrl = lifehack 
    ? `${window.location.origin}?hack=${lifehack.id}` 
    : window.location.href;
  
  const copyToClipboard = () => {
    if (inputRef.current) {
      inputRef.current.select();
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          toast({
            title: "Woohoo! Link copied!",
            description: "The Waffle Goblin lifehack has been copied to your clipboard!"
          });
          setIsBouncingGoblin(true);
          setTimeout(() => setIsBouncingGoblin(false), 1000);
        })
        .catch(err => {
          toast({
            title: "Oops! Copy failed",
            description: "The Waffle Goblin couldn't copy to your clipboard!",
            variant: "destructive"
          });
        });
    }
  };
  
  const shareOnPlatform = (platform: string) => {
    let url = '';
    const text = lifehack?.content || 'Check out this amazing lifehack from Waffle Goblin!';
    const hashtags = 'wafflegoblin,lifehack,tips';
    
    switch(platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}&hashtags=${hashtags}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
    }
    
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
      toast({
        title: `Sharing on ${platform.charAt(0).toUpperCase() + platform.slice(1)}!`,
        description: "Spread Waffle Goblin's wisdom with the world!"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-md bg-gradient-to-br from-yellow-50 to-green-50 border-2 border-[#5AE053] shadow-xl">
        <DialogHeader className="relative">
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
            <img 
              src={goblinLogo} 
              alt="Waffle Goblin" 
              className={`w-20 h-20 pixelated ${isBouncingGoblin ? 'animate-jump' : ''}`}
            />
          </div>
          <DialogTitle className="font-pixel text-[#3E2844] text-center text-xl mt-8 animate-float-slow">
            Share The Goblin Wisdom!
          </DialogTitle>
          <DialogClose className="text-[#3E2844] hover:text-[#8A2B43]" />
        </DialogHeader>
        
        <div className="grid grid-cols-4 gap-4 mb-6">
          <button 
            className="flex flex-col items-center group"
            onClick={() => shareOnPlatform('twitter')}
          >
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white mb-1 transform transition-transform group-hover:scale-110">
              <i className="ri-twitter-fill text-xl"></i>
            </div>
            <span className="text-xs">Twitter</span>
          </button>
          
          <button 
            className="flex flex-col items-center group"
            onClick={() => shareOnPlatform('facebook')}
          >
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white mb-1 transform transition-transform group-hover:scale-110">
              <i className="ri-facebook-fill text-xl"></i>
            </div>
            <span className="text-xs">Facebook</span>
          </button>
          
          <button 
            className="flex flex-col items-center group"
            onClick={() => shareOnPlatform('whatsapp')}
          >
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white mb-1 transform transition-transform group-hover:scale-110">
              <i className="ri-whatsapp-fill text-xl"></i>
            </div>
            <span className="text-xs">WhatsApp</span>
          </button>
          
          <button 
            className="flex flex-col items-center group"
            onClick={() => shareOnPlatform('linkedin')}
          >
            <div className="w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center text-white mb-1 transform transition-transform group-hover:scale-110">
              <i className="ri-linkedin-fill text-xl"></i>
            </div>
            <span className="text-xs">LinkedIn</span>
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-sm mb-2 font-medium text-center">Or copy this magical link:</p>
          <div className="flex">
            <Input
              ref={inputRef}
              type="text"
              value={shareUrl}
              className="rounded-r-none border-[#5AE053]"
              readOnly
            />
            <Button 
              className="bg-[#5AE053] text-white px-4 py-2 rounded-l-none font-pixel text-xs hover:bg-[#4AD043] hover:scale-105 transform transition-all duration-200"
              onClick={copyToClipboard}
            >
              <i className="ri-file-copy-line mr-1"></i> Copy
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
