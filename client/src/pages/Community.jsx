import React, { useEffect, useState } from "react";
import { dummyPublishedImages } from "../public/assets";
import Loading from "./Loading";

const Community = () => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    setLoading(true);
    if (loading) {
    return <Loading />;
  }
    setImages(dummyPublishedImages);
    setLoading(false);
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8 overflow-scroll">
      <h1 className="text-2xl font-bold">Community</h1>
      <div className="flex flex-col items-center justify-center gap-4 mt-8">
        <p className="text-gray-500 dark:text-gray-400">
          Explore the community and see what others are creating!
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 w-full ">
          {images.length > 0 ? (
            images.map((image, index) => (
              <div
                key={index}
                className="group cursor-pointer rounded-lg overflow-hidden relative"
              >
                <img
                  src={image.imageUrl}
                  alt={`Community creation ${index + 1}`}
                  className="w-full h-60 object-cover"
                />

                <p className="absolute bottom-0 w-full bg-black/60 text-white text-center py-2 opacity-0 group-hover:opacity-100 transition">
                  Created by sakshi
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No community creations to display. Be the first to create
              something amazing!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Community;
