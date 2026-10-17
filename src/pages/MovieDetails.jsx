import { useState } from "react";
import "./MovieDetails.css";

function MovieDetails({
  movie,
  user,
  onBack,
  onMyListChange,
}) {
  const [watching, setWatching] = useState(false);

  // ==============================
  // USER MY LIST KEY
  // ==============================

  const getMyListKey = () => {
    if (!user?.email) {
      return null;
    }

    return `myList_${user.email}`;
  };

  // ==============================
  // CHECK MY LIST
  // ==============================

  const [isInMyList, setIsInMyList] = useState(() => {
    const key = getMyListKey();

    if (!key) {
      return false;
    }

    const savedList = JSON.parse(
      localStorage.getItem(key) || "[]"
    );

    return savedList.some(
      (savedMovie) =>
        savedMovie.title === movie.title
    );
  });

  // ==============================
  // ADD / REMOVE MY LIST
  // ==============================

  const handleMyList = () => {

    // User must be logged in

    if (!user?.email) {
      alert("Please login to use My List.");
      return;
    }

    const key = getMyListKey();

    const savedList = JSON.parse(
      localStorage.getItem(key) || "[]"
    );

    let updatedList;

    if (isInMyList) {

      // REMOVE

      updatedList = savedList.filter(
        (savedMovie) =>
          savedMovie.title !== movie.title
      );

      setIsInMyList(false);

    } else {

      // ADD

      updatedList = [
        ...savedList,
        movie,
      ];

      setIsInMyList(true);
    }

    // Save USER-SPECIFIC list

    localStorage.setItem(
      key,
      JSON.stringify(updatedList)
    );

    // Tell App.jsx

    if (onMyListChange) {
      onMyListChange(updatedList);
    }
  };

  // ==============================
  // PAGE
  // ==============================

  return (
    <div className="movie-details-page">

      {/* BACK */}

      <button
        className="back-button"
        onClick={onBack}
      >
        ← Back
      </button>

      {!watching ? (

        <div className="details-container">

          <div
            className={`details-poster ${movie.posterClass}`}
          ></div>

          <div className="details-content">

            <p className="details-category">
              {movie.category}
            </p>

            <h1>
              {movie.title}
            </h1>

            <p className="details-meta">
              {movie.year} • {movie.duration} •{" "}
              {movie.rating}
            </p>

            <p className="details-description">
              {movie.description}
            </p>

            <div className="details-buttons">

              {/* WATCH */}

              <button
                className="watch-now-button"
                onClick={() =>
                  setWatching(true)
                }
              >
                ▶ Watch Now
              </button>

              {/* MY LIST */}

              <button
                className="add-list-button"
                onClick={handleMyList}
              >
                {isInMyList
                  ? "✓ Remove from My List"
                  : "+ My List"}
              </button>

            </div>

          </div>

        </div>

      ) : (

        <div className="video-container">

          <h1>
            {movie.title}
          </h1>

          <video
            className="video-player"
            controls
            autoPlay
          >

            <source
              src="https://www.w3schools.com/html/mov_bbb.mp4"
              type="video/mp4"
            />

            Your browser does not support
            video playback.

          </video>

          <p className="video-info">
            Now Playing: {movie.title}
          </p>

        </div>

      )}

    </div>
  );
}

export default MovieDetails;