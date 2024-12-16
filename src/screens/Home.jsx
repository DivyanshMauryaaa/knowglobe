import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './App.css';

function Home() {
  const [searchInput, setSearchInput] = useState('');
  const [featuredContent, setFeaturedContent] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch featured content from Wikipedia API
  useEffect(() => {
    const fetchFeaturedContent = async () => {
      try {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');

        const apiUrl = `https://en.wikipedia.org/api/rest_v1/feed/featured/${yyyy}/${mm}/${dd}`;
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Failed to fetch featured content');

        const data = await response.json();
        setFeaturedContent(data.mostread.articles);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching featured content:', error);
        setLoading(false);
      }
    };

    fetchFeaturedContent();
  }, []);

  // Fetch search results from Wikipedia API
  const fetchSearchResults = async (query) => {
    try {
      const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srsearch=${query}`;
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Failed to fetch search results');

      const data = await response.json();
      setSearchResults(data.query.search);
      setIsSearching(true); // Show search results
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  // Handle search input change
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
  
    if (value.trim()) {
      fetchSearchResults(value); // Fetch search results if there’s input
    } else {
      setIsSearching(false); // Reset to show featured content
      setSearchResults([]); // Clear the search results
    }
  };
  
  return (
    <div className="main">
      <div className="header">
        <center>
          <input
            placeholder="Search Articles here......"
            style={{ width: '90%', padding: '10px', marginTop: 10 }}
            value={searchInput}
            onChange={handleSearchInputChange}
          />
        </center>
      </div>

      <div className="content">
        <center>
          {isSearching ? (
            <>
              <h1>Search Results</h1>
              {searchResults.length > 0 ? (
                <div className="FcontentCards">
                  {searchResults.map((result, index) => (
                    <div key={index} className="FeautredCard">
                      <h3>{result.title}</h3>
                      <p>{result.snippet.replace(/(<([^>]+)>)/gi, '') || 'No description available'}</p>
                      <Link to={`/article/${encodeURIComponent(result.title)}`}>
                        Read More
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No results found.</p>
              )}
            </>
          ) : (
            <>
              <h1>Featured Content Today</h1>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div className="FcontentCards">
                  {featuredContent.map((article, index) => (
                    <div key={index} className="FeautredCard">
                      {article.thumbnail && (
                        <img
                          src={article.thumbnail.source}
                          alt={article.title}
                          className="articleImage"
                        />
                      )}
                      <h3>{article.title}</h3>
                      <p>{article.description || 'No description available'}</p>
                      <Link to={`/article/${encodeURIComponent(article.title)}`}>
                        Read More
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </center>
      </div>
    </div>
  );
}

export default Home;
