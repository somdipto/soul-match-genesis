
import React from 'react';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
      <path d="M17.8 12.2H12.5V14.5H15.5C15.1 15.7 14 16.5 12.5 16.5C10.6 16.5 9 14.9 9 13C9 11.1 10.6 9.5 12.5 9.5C13.3 9.5 14 9.8 14.6 10.3L16.5 8.4C15.3 7.3 13.9 6.7 12.5 6.7C9 6.7 6.2 9.5 6.2 13C6.2 16.5 9 19.3 12.5 19.3C15.8 19.3 18.5 17 18.5 13C18.5 12.7 18.4 12.5 18.3 12.2H17.8Z" />
    </svg>
  );
};

export default GoogleIcon;
