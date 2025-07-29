const NotFound = () => {
    return (
      <div className="not-found">
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <button onClick={() => window.location.href = "/"}>Return Home</button>
      </div>
    );
  };
  
  export default NotFound;
  