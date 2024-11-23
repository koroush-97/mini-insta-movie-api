

import React, { useEffect, useState, useRef, useCallback } from "react";
import "./ExpolorePostes.css";
import { Box } from "@mui/material";

export default function ExplorePostes() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const observer = useRef();

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://dummyapi.online/api/movies?page=${page}`);
      if (!res.ok) throw new Error("Failed to fetch data");
      const result = await res.json();
      setMovies((prevMovies) => [...prevMovies, ...result]);
      console.log(result);
      console.log(`https://dummyapi.online/${result[0].image}`);

    } catch (err) {
      console.error("Error fetching movies:", err);
      setError("خطا در دریافت داده‌ها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [page]);

  const lastMovieElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    []
  );

  return (
    <>
      {error && <p>{error}</p>}
      {movies.length ? (
        movies.map((movie, index) => {
          if (movies.length === index + 1) {
            return (
              <Box ref={lastMovieElementRef} key={movie.id} className="gridPostes">
                <div style={{ textAlign: "center" }}>
                
                  <a href={movie.imdb_url} target="_blank" rel="noopener noreferrer">
                     <img
                    style={{
                      cursor: "pointer",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      border : "2px solid red"
                     
                    }}
                    src={`https://dummyapi.online/${movie.image}`}


                    alt={movie.movie}
                  />
                  </a>
                </div>
              </Box>
            );
          } else {
            return (
              <Box key={movie.id} className="gridPostes">
                <div style={{ textAlign: "center" }}>
                <a href={movie.imdb_url} target="_blank" rel="noopener noreferrer">
                  <span>{movie.movie}</span>
                  <img
                    style={{
                      cursor: "pointer",
                      width: "100%",
                      height: "auto",
                      objectFit: "cover",
                      
                    }}
                    src={movie.image}
                    alt={movie.movie}
                  />
                  </a>
                </div>
              </Box>
            );
          }
        })
      ) : (
        <p>فیلم‌ها در حال بارگذاری است...</p>
      )}
      {loading && <p>در حال بارگذاری...</p>}
    </>
  );
}

