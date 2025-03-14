import React from "react";

export function AdminBackgroundPattern() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden opacity-40 dark:opacity-20 pointer-events-none">
      <div className="absolute -top-[10%] -right-[10%] w-1/2 h-1/2">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path
            fill="#567C8D"
            d="M38.9,-69.5C50.4,-60.9,59.4,-49.7,65.6,-37.2C71.7,-24.7,74.9,-12.3,75.2,0.2C75.4,12.7,72.7,25.4,66.5,37.1C60.3,48.8,50.6,59.4,38.5,65.1C26.4,70.9,13.2,71.8,-0.6,72.9C-14.5,74,-29,75.2,-40.8,69.5C-52.6,63.7,-61.7,50.9,-67.9,37.3C-74,23.7,-77.2,9.4,-76.7,-4.8C-76.1,-19,-71.8,-33.8,-63.4,-44.9C-55,-56,-42.5,-63.5,-29.9,-70.9C-17.2,-78.3,-4.3,-85.7,7.7,-84.3C19.8,-82.8,27.4,-78.1,38.9,-69.5Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>
      <div className="absolute top-[40%] -left-[10%] w-1/3 h-1/3">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path
            fill="#2F4156"
            d="M42.7,-76.5C53.9,-67.7,60.8,-53.1,67.1,-39C73.4,-24.8,79.1,-11.1,78.8,2.3C78.6,15.8,72.5,28.4,64.3,39.8C56.1,51.1,45.8,61.1,33.6,69.4C21.5,77.7,7.4,84.3,-5.9,82.7C-19.2,81.1,-31.6,71.4,-42.9,62C-54.2,52.6,-64.4,43.4,-70.1,31.5C-75.9,19.6,-77.3,4.9,-76.2,-9.9C-75.1,-24.8,-71.6,-39.7,-63,-52.2C-54.4,-64.6,-40.7,-74.5,-26.7,-78.1C-12.6,-81.8,1.9,-79.1,15.4,-74.6C29,-70.1,31.5,-85.3,42.7,-76.5Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>
      <div className="absolute bottom-[10%] right-[20%] w-1/4 h-1/4">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path
            fill="#C8D9E6"
            d="M33.5,-54.7C43.3,-46.5,50.9,-36.2,56.2,-24.5C61.5,-12.9,64.5,0.2,62.3,12.5C60.2,24.8,52.8,36.3,42.9,44.8C33,53.3,20.5,58.8,7.1,60.9C-6.4,63,-20.8,61.8,-33.8,56.2C-46.8,50.6,-58.3,40.6,-64.8,27.4C-71.2,14.2,-72.5,-2.1,-68.5,-16.5C-64.6,-30.9,-55.4,-43.2,-43.6,-51.1C-31.8,-59,-15.9,-62.5,-1.4,-60.3C13.1,-58.1,23.7,-63,33.5,-54.7Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>
      <div className="grid grid-cols-12 grid-rows-12 gap-8 h-full w-full">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="rounded-full bg-navy/5 dark:bg-sky-blue/5"
            style={{
              gridColumn: `${Math.floor(Math.random() * 12) + 1} / span 1`,
              gridRow: `${Math.floor(Math.random() * 12) + 1} / span 1`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function FacultyBackgroundPattern() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden opacity-40 dark:opacity-20 pointer-events-none">
      {/* Teacher's desk pattern */}
      <div className="absolute bottom-0 w-full h-1/6 grid grid-cols-12 overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="relative w-full h-full"
          >
            <div className="absolute bottom-0 left-0 right-0 h-full transform origin-bottom scale-y-0 bg-teal/10 dark:bg-teal/20 animate-pulse"
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: '3s',
                transform: 'scaleY(1)',
              }}
            />
          </div>
        ))}
      </div>
      
      {/* Blackboard pattern */}
      <div className="absolute top-[10%] left-[10%] right-[10%] h-1/4 bg-navy/10 dark:bg-teal/10 rounded-lg">
        <div className="flex justify-center items-center h-full">
          <div className="w-[80%] h-[70%] border-dashed border-2 border-navy/20 dark:border-white/20 rounded"></div>
        </div>
      </div>
      
      {/* Random books */}
      <div className="absolute top-[45%] left-[5%] h-1/6 w-1/6">
        <div className="h-full w-full bg-teal/10 dark:bg-teal/20 rounded-sm"></div>
      </div>
      <div className="absolute top-[45%] left-[15%] h-1/5 w-1/7">
        <div className="h-full w-full bg-sky-blue/10 dark:bg-sky-blue/20 rounded-sm"></div>
      </div>
      <div className="absolute top-[42%] left-[21%] h-1/4 w-1/8">
        <div className="h-full w-full bg-navy/10 dark:bg-white/10 rounded-sm"></div>
      </div>
      
      {/* Random books on right */}
      <div className="absolute top-[50%] right-[15%] h-1/7 w-1/5">
        <div className="h-full w-full bg-teal/10 dark:bg-teal/15 rounded-sm"></div>
      </div>
      <div className="absolute top-[45%] right-[5%] h-1/5 w-1/6">
        <div className="h-full w-full bg-sky-blue/15 dark:bg-sky-blue/15 rounded-sm"></div>
      </div>
    </div>
  );
}

export function StudentBackgroundPattern() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden opacity-40 dark:opacity-20 pointer-events-none">
      {/* Notebook lines */}
      <div className="absolute inset-0 flex flex-col justify-start">
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className="w-full h-[1px] bg-navy/10 dark:bg-sky-blue/15 transform"
            style={{ marginTop: `${i * 20 + 50}px` }}
          />
        ))}
      </div>
      
      {/* Pencil */}
      <div className="absolute top-[15%] -right-[5%] w-1/4 h-1/4 rotate-45">
        <div className="w-full h-[10px] bg-sky-blue/20 dark:bg-sky-blue/30 rounded-l-full"></div>
        <div className="w-[95%] h-[60px] bg-yellow-100/30 dark:bg-yellow-100/20"></div>
        <div className="w-[10%] h-[15px] bg-navy/20 dark:bg-white/20 rounded-b-sm"></div>
      </div>
      
      {/* Book */}
      <div className="absolute bottom-[10%] left-[10%] w-1/5 h-1/6">
        <div className="w-full h-full bg-navy/10 dark:bg-sky-blue/20 rounded-lg rounded-l-none border-l-4 border-navy/20 dark:border-sky-blue/30"></div>
      </div>
      
      {/* Random notes */}
      <div className="absolute top-[30%] left-[20%] w-1/6 h-1/8 rotate-6">
        <div className="w-full h-full bg-yellow-100/20 dark:bg-yellow-100/10 rounded-sm"></div>
      </div>
      <div className="absolute bottom-[30%] right-[25%] w-1/5 h-1/10 -rotate-12">
        <div className="w-full h-full bg-yellow-100/30 dark:bg-yellow-100/5 rounded-sm"></div>
      </div>
    </div>
  );
}