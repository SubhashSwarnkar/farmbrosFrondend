import React from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import banner1 from "../assets/Banners/36166.jpg";
import banner2 from "../assets/Banners/361661.jpg";
import banner3 from "../assets/Banners/361662.jpg";
const banners = [
  { id: 1, img: banner1 },
  { id: 2, img: banner2 },
  { id: 3, img: banner3 },
 
];

function Banners() {
  return (
    <div className="banner-container">
      <Splide
        options={{
          type: "loop",
          autoplay: true,
          interval: 2000,
          pauseOnHover: false,
          arrows: true,
          pagination: true,
          drag: "free",
        }}
      >
        {banners.map((banner) => (
          <SplideSlide key={banner.id}>
            <img
              src={banner.img}
              alt={`Banner ${banner.id}`}
              style={{ width: "100%", height: "40vh", borderRadius: "10px" }}
            />
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
}

export default Banners;
