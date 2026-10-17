
import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MovieDetails from "./pages/MovieDetails";
import Profile from "./pages/Profile";
import "./App.css";

const movies = [
  {
    id: 1,
    title: "The Last Horizon",
    genre: "Sci-Fi",
    year: 2026,
    description:
      "A thrilling journey beyond the stars, where humanity searches for a new home.",
    poster:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=500&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Dark Universe",
    genre: "Adventure",
    year: 2025,
    description:
      "An unexpected discovery changes everything the crew knows about space.",
    poster:
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=500&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Lost in Time",
    genre: "Fantasy",
    year: 2025,
    description:
      "A mysterious clock opens a door to another time.",
    poster:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=500&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Beyond Earth",
    genre: "Documentary",
    year: 2024,
    description:
      "Explore the wonders of our universe and the mysteries beyond.",
    poster:
      "https://images.unsplash.com/photo-1464802686167-b939a6910659?w=500&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "The Final Mission",
    genre: "Action",
    year: 2025,
    description:
      "One final mission stands between the world and disaster.",
    poster:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "Midnight City",
    genre: "Thriller",
    year: 2024,
    description:
      "A detective uncovers a secret hidden beneath the city lights.",
    poster:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=500&auto=format&fit=crop",
  },
];

function readSavedList(user) {
  if (!user?.email) return [];

  try {
    return JSON.parse(
      localStorage.getItem(`myList_${user.email}`) || "[]"
    );
  } catch {
    return [];
  }
}

function App() {
  const [page, setPage] = useState("home");
  const [selectedMovie, setSelectedMovie] = useState(movies[0]);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });
  const [myList, setMyList] = useState(() => readSavedList(user));

  function navigate(nextPage) {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleLogin(loggedInUser) {
    if (loggedInUser) {
      setUser(loggedInUser);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      setMyList(readSavedList(loggedInUser));
    }
    navigate("home");
  }

  function handleLogout() {
    setUser(null);
    setMyList([]);
    localStorage.removeItem("user");
    navigate("home");
  }

  function toggleMyList(movie) {
    if (!user?.email) {
      navigate("login");
      return;
    }

    const alreadySaved = myList.some((item) => item.id === movie.id);

    const updatedList = alreadySaved
      ? myList.filter((item) => item.id !== movie.id)
      : [...myList, movie];

    setMyList(updatedList);
    localStorage.setItem(
      `myList_${user.email}`,
      JSON.stringify(updatedList)
    );
  }

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  if (page === "login") {
    return (
      <Login
        onBack={() => navigate("home")}
        onRegister={() => navigate("register")}
        onLoginSuccess={handleLogin}
      />
    );
  }

  if (page === "register") {
    return (
      <Register
        onBack={() => navigate("home")}
        onLogin={() => navigate("login")}
        onRegisterSuccess={handleLogin}
      />
    );
  }

  if (page === "details") {
    return (
      <MovieDetails
        movie={selectedMovie}
        user={user}
        myList={myList}
        onToggleMyList={toggleMyList}
        onBack={() => navigate("home")}
        setPage={setPage}
        onNavigate={navigate}
      />
    );
  }

  if (page === "profile") {
    return (
      <Profile
        user={user}
        myList={myList}
        onLogout={handleLogout}
        setPage={setPage}
        onNavigate={navigate}
      />
    );
  }

  return (
    <div className="streamx">
      <header className="navbar">
        <button
          className="logo"
          onClick={() => navigate("home")}
        >
          STREAM<span>X</span>
        </button>

        <nav className="nav-links">
          <button onClick={() => navigate("home")}>Home</button>
          <button
            onClick={() =>
              document
                .getElementById("movies")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Movies
          </button>
          <button
            onClick={() => {
              if (!user) {
                navigate("login");
                return;
              }
              document
                .getElementById("my-list")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            My List
          </button>
        </nav>

        <div className="nav-actions">
          <input
            className="search-input"
            type="search"
            placeholder="Search movies..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              document
                .getElementById("movies")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          />

          {user ? (
            <>
              <button
                className="nav-button"
                onClick={() => navigate("profile")}
              >
                Profile
              </button>
              <button
                className="nav-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="nav-button"
                onClick={() => navigate("login")}
              >
                Login
              </button>
              <button
                className="primary-button"
                onClick={() => navigate("register")}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">YOUR ENTERTAINMENT DESTINATION</p>
            <h1>
              Stories That
              <br />
              Move You<span>.</span>
            </h1>
            <p className="hero-description">
              Discover incredible movies, explore new worlds,
              and find your next favorite story on STREAMX.
            </p>

            <div className="hero-actions">
              <button
                className="primary-button"
                onClick={() => {
                  setSelectedMovie(movies[0]);
                  navigate("details");
                }}
              >
                ▶ Explore Featured Movie
              </button>
              <button
                className="secondary-button"
                onClick={() =>
                  document
                    .getElementById("movies")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Browse Movies
              </button>
            </div>
          </div>
        </section>

        <section className="movie-section" id="movies">
          <div className="section-heading">
            <div>
              <p className="eyebrow">HANDPICKED FOR YOU</p>
              <h2>{search ? "Search Results" : "Explore Movies"}</h2>
            </div>
            <span>{filteredMovies.length} movies</span>
          </div>

          {filteredMovies.length === 0 ? (
            <p className="empty-message">
              No movies found. Try another title.
            </p>
          ) : (
            <div className="movie-grid">
              {filteredMovies.map((movie) => {
                const isSaved = myList.some(
                  (item) => item.id === movie.id
                );

                return (
                  <article className="movie-card" key={movie.id}>
                    <button
                      className="poster-button"
                      onClick={() => {
                        setSelectedMovie(movie);
                        navigate("details");
                      }}
                      aria-label={`View ${movie.title}`}
                    >
                      <img
                        className="movie-poster"
                        src={movie.poster}
                        alt={`${movie.title} poster`}
                        loading="lazy"
                      />
                      <span className="poster-play">▶</span>
                    </button>

                    <div className="movie-info">
                      <div>
                        <h3>{movie.title}</h3>
                        <p>
                          {movie.year} · {movie.genre}
                        </p>
                      </div>

                      <button
                        className="list-button"
                        onClick={() => toggleMyList(movie)}
                        title={
                          isSaved
                            ? "Remove from My List"
                            : "Add to My List"
                        }
                      >
                        {isSaved ? "✓" : "+"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {user && (
          <section className="movie-section" id="my-list">
            <div className="section-heading">
              <div>
                <p className="eyebrow">YOUR COLLECTION</p>
                <h2>My List</h2>
              </div>
              <span>{myList.length} saved</span>
            </div>

            {myList.length === 0 ? (
              <p className="empty-message">
                Your list is empty. Press + on a movie to save it here.
              </p>
            ) : (
              <div className="movie-grid">
                {myList.map((movie) => (
                  <article className="movie-card" key={movie.id}>
                    <button
                      className="poster-button"
                      onClick={() => {
                        setSelectedMovie(movie);
                        navigate("details");
                      }}
                    >
                      <img
                        className="movie-poster"
                        src={movie.poster}
                        alt={`${movie.title} poster`}
                        loading="lazy"
                      />
                      <span className="poster-play">▶</span>
                    </button>

                    <div className="movie-info">
                      <div>
                        <h3>{movie.title}</h3>
                        <p>
                          {movie.year} · {movie.genre}
                        </p>
                      </div>
                      <button
                        className="list-button"
                        onClick={() => toggleMyList(movie)}
                        title="Remove from My List"
                      >
                        ✓
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="footer">
        <button className="logo" onClick={() => navigate("home")}>
          STREAM<span>X</span>
        </button>
        <p>Discover your next favorite story.</p>
        <p>© {new Date().getFullYear()} STREAMX</p>
      </footer>
    </div>
  );
}

export default App;
