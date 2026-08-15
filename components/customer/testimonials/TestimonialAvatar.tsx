import React from 'react';

interface TestimonialAvatarProps {
  initials: string;
}

export const TestimonialAvatar = ({ initials }: TestimonialAvatarProps) => {
  return (
    <div className="flex items-center justify-center w-11 h-11 rounded-full bg-primary/10 border border-primary/30 text-primary font-serif font-bold text-base shadow-inner">
      {initials}
    </div>
  );
};
