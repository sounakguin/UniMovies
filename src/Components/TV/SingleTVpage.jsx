import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const API_KEY = "d00cb3e60d55a92130bdafb5ff634708";

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 6 },
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 5 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
};

const responsive2 = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 7 },
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 6 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 2 },
};

const responsive3 = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 5 },
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
};

const fetchData = async (id) => {
  const urls = [
    `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${API_KEY}&language=en-US`,
    `https://api.themoviedb.org/3/tv/${id}/images?api_key=${API_KEY}&language=en-US&include_image_language=en,null`,
    `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${API_KEY}&language=en-US`,
    `https://api.themoviedb.org/3/tv/${id}/similar?api_key=${API_KEY}&language=en-US`,
    `https://api.themoviedb.org/3/tv/${id}/recommendations?api_key=${API_KEY}&language=en-US`,
  ];

  const responses = await Promise.all(urls.map((url) => fetch(url)));
  const data = await Promise.all(responses.map((res) => res.json()));

  return {
    videos: data[0].results,
    posters: data[1].posters,
    backdrops: data[1].backdrops,
    credits: data[2].cast,
    similar: data[3].results,
    recommendations: data[4].results,
  };
};

const CarouselItem = React.memo(({ item, type }) => (
  <div className="p-2">
    {item.poster_path ? (
      <img
        src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
        alt={item.name}
        className={`w-full h-full object-cover rounded-lg ${type === 'person' ? 'h-52 w-52' : ''}`}
      />
    ) : (
      <div>
        <img
          src="/Images/klkl.jpg"
          alt={item.name}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
    )}
    <p className="text-white pt-4 text-center">{item.name}</p>
  </div>
));

export default function SingleTVpage() {
  const { id } = useParams();
  const [data, setData] = useState({
    videos: [],
    posters: [],
    backdrops: [],
    credits: [],
    similar: [],
    recommendations: [],
  });

  const fetchTVData = useCallback(async () => {
    try {
      const fetchedData = await fetchData(id);
      setData(fetchedData);
    } catch (error) {
      console.error("Error fetching TV data:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchTVData();
  }, [fetchTVData]);

  return (
    <div className="container mx-auto p-4">
      {data.credits.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white pl-0 md:pl-2 text-center md:text-left">
            Credits
          </h2>
          <Carousel responsive={responsive} {...commonCarouselSettings}>
            {data.credits.map((credit) => (
              <Link key={credit.id} to={`/person/${credit.id}`}>
                <CarouselItem item={credit} type="person" />
              </Link>
            ))}
          </Carousel>
        </div>
      )}

      {data.videos.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 mt-5 text-white pl-0 md:pl-2 text-center md:text-left">
            Watch Videos and Trailers
          </h2>
          <Carousel responsive={responsive3} {...commonCarouselSettings}>
            {data.videos.map((video) => (
              <div key={video.key} className="px-2 flex justify-center">
                <div className="rounded-lg">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.key}`}
                    title={video.name}
                    className="w-auto h-52 border-none"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      )}

      {data.backdrops.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white pl-0 md:pl-2 text-center md:text-left">
            Backdrops
          </h2>
          <Carousel responsive={responsive} {...commonCarouselSettings}>
            {data.backdrops.map((backdrop) => (
              <CarouselItem key={backdrop.file_path} item={backdrop} type="backdrop" />
            ))}
          </Carousel>
        </div>
      )}

      {data.posters.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white pl-0 md:pl-2 text-center md:text-left">
            Posters
          </h2>
          <Carousel responsive={responsive2} {...commonCarouselSettings}>
            {data.posters.map((poster) => (
              <CarouselItem key={poster.file_path} item={poster} type="poster" />
            ))}
          </Carousel>
        </div>
      )}

      {data.similar.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white pl-0 md:pl-2 text-center md:text-left">
            Similar TV Shows
          </h2>
          <Carousel responsive={responsive2} {...commonCarouselSettings}>
            {data.similar.map((tvShow) => (
              <Link key={tvShow.id} to={`/tv/${tvShow.id}`}>
                <CarouselItem item={tvShow} type="similar" />
              </Link>
            ))}
          </Carousel>
        </div>
      )}

      {data.recommendations.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-white pl-0 md:pl-2 text-center md:text-left">
            Recommended TV Shows
          </h2>
          <Carousel responsive={responsive2} {...commonCarouselSettings}>
            {data.recommendations.map((tvShow) => (
              <Link key={tvShow.id} to={`/tv/${tvShow.id}`}>
                <CarouselItem item={tvShow} type="recommendation" />
              </Link>
            ))}
          </Carousel>
        </div>
      )}
    </div>
  );
}

const commonCarouselSettings = {
  infinite: true,
  autoPlay: true,
  autoPlaySpeed: 5000,
  keyBoardControl: true,
  transitionDuration: 1000,
  arrows: true,
  showDots: false,
  containerClass: "carousel-container",
  itemClass: "carousel-item",
};
