import { useAuth } from "../context/AuthContext";

const Favorites = () => {
  const { favorites } = useAuth();
  return (
    <div className="favorites-page">
      <h1>Your Favorite Movies</h1>
      {favorites.length > 0 ? (
        <div className="favorites-grid">
          {/* Map your favorite movies here */}
        </div>
      ) : (
        <p>You haven't added any favorites yet.</p>
      )}
    </div>
  );
};

export default Favorites;
