import React from "react";

export default function Streamingpartner() {
  const data = [
    { image: "Images/cruncyroll.png" },

    { image: "Images/hulu.png" },
    { image: "Images/jio.png" },
    { image: "Images/max.jpeg" },
    { image: "Images/netflix.jpg" },
    { image: "Images/parmount.png" },
    { image: "Images/prime.png" },
    { image: "Images/stan.png" },
    { image: "Images/tv+.jpeg" },
    { image: "Images/hotstar.png" },
    { image: "Images/zee5.jpg" },
  ];

  return (
    <div className="overflow-hidden w-full">
      <div className="flex gap-3 animate-scroll">
        {data.concat(data).map((item, index) => (
          <div key={index} className="flex-shrink-0">
            <img
              src={item.image}
              className="h-36 w-52 border border-white"
              alt="Streaming partner"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
