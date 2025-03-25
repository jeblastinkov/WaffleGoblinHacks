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

interface SocialShareProps {
  isOpen: boolean;
  onClose: () => void;
  lifehack: LifehackModel | null;
}

export default function SocialShare({ isOpen, onClose, lifehack }: SocialShareProps) {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Generate a sharable URL
  const shareUrl = lifehack 
    ? `${window.location.origin}/lifehack/${lifehack.id}` 
    : window.location.href;
  
  const copyToClipboard = () => {
    if (inputRef.current) {
      inputRef.current.select();
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          toast({
            title: "Link copied!",
            description: "The link has been copied to your clipboard."
          });
        })
        .catch(err => {
          toast({
            title: "Failed to copy",
            description: "Could not copy the link to clipboard.",
            variant: "destructive"
          });
        });
    }
  };
  
  const shareOnPlatform = (platform: string) => {
    let url = '';
    const text = lifehack?.content || 'Check out this amazing lifehack from Waffle Goblin!';
    
    switch(platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
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
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-pixel text-[#3E2844]">Share Lifehack</DialogTitle>
          <DialogClose className="text-[#3E2844] hover:text-[#8A2B43]" />
        </DialogHeader>
        
        <div className="grid grid-cols-4 gap-4 mb-6">
          <button 
            className="flex flex-col items-center"
            onClick={() => shareOnPlatform('twitter')}
          >
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white mb-1">
              <i className="ri-twitter-fill text-xl"></i>
            </div>
            <span className="text-xs">Twitter</span>
          </button>
          
          <button 
            className="flex flex-col items-center"
            onClick={() => shareOnPlatform('facebook')}
          >
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white mb-1">
              <i className="ri-facebook-fill text-xl"></i>
            </div>
            <span className="text-xs">Facebook</span>
          </button>
          
          <button 
            className="flex flex-col items-center"
            onClick={() => shareOnPlatform('whatsapp')}
          >
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white mb-1">
              <i className="ri-whatsapp-fill text-xl"></i>
            </div>
            <span className="text-xs">WhatsApp</span>
          </button>
          
          <button 
            className="flex flex-col items-center"
            onClick={() => shareOnPlatform('linkedin')}
          >
            <div className="w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center text-white mb-1">
              <i className="ri-linkedin-fill text-xl"></i>
            </div>
            <span className="text-xs">LinkedIn</span>
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-sm mb-2">Or copy this link:</p>
          <div className="flex">
            <Input
              ref={inputRef}
              type="text"
              value={shareUrl}
              className="rounded-r-none"
              readOnly
            />
            <Button 
              className="bg-[#5AE053] text-white px-4 py-2 rounded-l-none font-pixel text-xs"
              onClick={copyToClipboard}
            >
              Copy
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
