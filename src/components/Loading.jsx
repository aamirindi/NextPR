import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/loading.json";

const Loading = () => {
  const [isSmallDevice, setIsSmallDevice] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallDevice(window.innerWidth <= 500);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!isSmallDevice) return null;

  return (
    <div className="flex w-full h-screen justify-center items-center animate_2 loading border">
        <Lottie
          animationData={loadingAnimation}
          style={{
            height: 150,
            width: 150,
            filter:
              "brightness(0) saturate(100%) sepia(10%) hue-rotate(0deg) saturate(500%)",
          }}
        />
    </div>
  );
};

export default Loading;
