'use client';

import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
} from 'next-share';
import { Copy } from 'lucide-react';

export default function ShareButtons({ url, title }: { url: string; title: string }) {
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy link: ', err);
    }
  };
  

  return (
    <div className="flex gap-4 items-center">
      <h3 className="text-lg font-semibold">Share this page:</h3>
      
  
    <div className="flex gap-4 items-center">
      {/* Twitter */}
      <TwitterShareButton url={url} title={title}>
        <TwitterIcon size={25} round />
      </TwitterShareButton>

      {/* LinkedIn */}
      <LinkedinShareButton url={url}>
        <LinkedinIcon size={25} round />
      </LinkedinShareButton>

      {/* Facebook */}
      <FacebookShareButton url={url}>
        <FacebookIcon size={25} round />
      </FacebookShareButton>

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
        aria-label="Copy Link"
      >
        <Copy size={15} />
      </button>
    </div>
    </div>
  );
}
