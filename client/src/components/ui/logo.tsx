import React from "react";

export function UniManageLogo() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-colors duration-300"
    >
      <rect width="40" height="40" rx="8" className="fill-navy dark:fill-sky-blue" />
      <path
        d="M8 16L20 8L32 16V18H8V16Z"
        className="fill-sky-blue dark:fill-navy"
      />
      <rect
        x="11"
        y="20"
        width="18"
        height="12"
        className="fill-white dark:fill-teal"
      />
      <rect x="18" y="20" width="4" height="12" className="fill-teal dark:fill-white" />
      <rect
        x="16"
        y="18"
        width="8"
        height="2"
        className="fill-white dark:fill-teal"
      />
      <rect x="13" y="22" width="4" height="1" className="fill-navy dark:fill-white" />
      <rect x="13" y="25" width="3" height="1" className="fill-navy dark:fill-white" />
      <rect x="13" y="28" width="3" height="1" className="fill-navy dark:fill-white" />
      <rect x="23" y="22" width="4" height="1" className="fill-navy dark:fill-white" />
      <rect x="24" y="25" width="3" height="1" className="fill-navy dark:fill-white" />
      <rect x="24" y="28" width="3" height="1" className="fill-navy dark:fill-white" />
    </svg>
  );
}

export function AdminLogo() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="animate-float"
    >
      <circle cx="40" cy="40" r="36" className="fill-navy/10 dark:fill-sky-blue/20" />
      <path
        d="M40 20C33.3726 20 28 25.3726 28 32C28 38.6274 33.3726 44 40 44C46.6274 44 52 38.6274 52 32C52 25.3726 46.6274 20 40 20ZM24 56C24 49.3726 31.1634 44 40 44C48.8366 44 56 49.3726 56 56V60H24V56Z"
        className="fill-navy dark:fill-sky-blue"
      />
      <circle cx="53" cy="24" r="10" className="fill-teal dark:fill-teal" />
      <rect x="48" y="22" width="10" height="4" rx="2" fill="white" />
      <rect x="51" y="19" width="4" height="10" rx="2" fill="white" />
    </svg>
  );
}

export function FacultyLogo() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="animate-float"
    >
      <circle cx="40" cy="40" r="36" className="fill-teal/10 dark:fill-teal/20" />
      <path
        d="M20 24H60V56H20V24Z"
        className="fill-teal dark:fill-teal"
      />
      <path d="M24 28H56V38H24V28Z" fill="white" />
      <path d="M24 42H40V52H24V42Z" fill="white" />
      <path d="M44 42H56V44H44V42Z" fill="white" />
      <path d="M44 46H56V48H44V46Z" fill="white" />
      <path d="M44 50H56V52H44V50Z" fill="white" />
      <line x1="39" y1="44" x2="39" y2="50" stroke="white" strokeWidth="2" />
      <line x1="34" y1="44" x2="34" y2="50" stroke="white" strokeWidth="2" />
      <line x1="29" y1="44" x2="29" y2="50" stroke="white" strokeWidth="2" />
    </svg>
  );
}

export function StudentLogo() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="animate-float"
    >
      <circle cx="40" cy="40" r="36" className="fill-sky-blue/10 dark:fill-sky-blue/20" />
      <path
        d="M40 20L20 30L40 40L60 30L40 20Z"
        className="fill-sky-blue dark:fill-sky-blue"
      />
      <path d="M28 33V45L40 52L52 45V33L40 40L28 33Z" className="fill-navy dark:fill-white" />
      <path
        d="M40 16L42 18H46C47.1046 18 48 18.8954 48 20V23C48 24.1046 47.1046 25 46 25H34C32.8954 25 32 24.1046 32 23V20C32 18.8954 32.8954 18 34 18H38L40 16Z"
        className="fill-navy dark:fill-white"
      />
      <rect x="38" y="52" width="4" height="10" className="fill-navy dark:fill-sky-blue" />
      <rect x="34" y="60" width="12" height="2" className="fill-navy dark:fill-sky-blue" />
    </svg>
  );
}