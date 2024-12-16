import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import './ArticlePage.css'

// Function to clean up any remaining unwanted tags or attributes
const cleanWikiContent = (content) => {
    // For simplicity, just cleaning up some common unwanted markup, like removing template tags
    let cleanedContent = content.replace(/{{[^}]*}}/g, ''); // Remove MediaWiki template tags

    // Handle specific cases like removing HTML comments if necessary
    cleanedContent = cleanedContent.replace(/<!--[\s\S]*?-->/g, ''); // Remove HTML comments

    return cleanedContent;
};

function ArticlePage() {
    const { title } = useParams();  // Get the dynamic title from URL
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticle = async () => {
            setLoading(true);
            setError(null); // Reset error state if any

            try {
                // Use action=parse to get HTML version of the article
                const apiUrl = `https://en.wikipedia.org/w/api.php?action=parse&page=${title}&format=json&origin=*`;
                const response = await fetch(apiUrl);
                const data = await response.json();

                if (data.error) {
                    setError(data.error.info); // Display error message if article is not found
                    setLoading(false);
                    return;
                }

                // Extract the HTML content and clean it
                const content = data.parse.text["*"];
                const cleanedContent = cleanWikiContent(content);

                setArticle({
                    title: data.parse.title,
                    content: cleanedContent,
                });

                setLoading(false);
            } catch (error) {
                console.error("Error fetching article:", error);
                setError("Failed to fetch article.");
                setLoading(false);
            }
        };

        fetchArticle();
    }, [title]);

    // Handle loading and error states
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <main>
            <div className="articlePage">
                <Link to={"/"} className="back-arrow">&larr;</Link>
                <h1 className="title">{article.title}</h1>
                <div
                    className="content"
                    dangerouslySetInnerHTML={{ __html: article.content }} // Render the cleaned HTML content
                />
            </div>
        </main>
    );
}

export default ArticlePage;
