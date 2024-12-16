import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./screens/Home"; // Your Home component
import ArticlePage from "./screens/ArticleContent"; // Your ArticlePage component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/article/:title" element={<ArticlePage />} />
      </Routes>
    </Router>
  );
}

export default App;
