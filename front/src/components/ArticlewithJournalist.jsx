import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getArticles, removeArticle, getArticlesWithJournalists, gerArticlesWithCategory} from "../services/api.js";

//
// ArticleList component
//
export default function ArticleList() {
    const params = parseInt(window.location.pathname.split("/")[2]);
  const [articles, setArticles] = useState([]);
  const [categorys, setCategory] = useState();
  const [nameJ, setname] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles(); 
    fetchCategory();// Fetch all articles when component mounts
  }, []);

  useEffect(() => {
    if (nameJ) {
      console.log("Name has been updated to:", nameJ);
    }
  }, [nameJ]);

  useEffect(() => {
    console.log(categorys);
  }, [categorys]);


  const fetchArticles = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getArticlesWithJournalists(params);
      console.log("data:", data, typeof(params));
      const datajournalists = await getArticlesWithJournalists(data[0].journalistid);
      // console.log("datajournalists:", typeof(datajournalists[0].NAME));
      const name = String(datajournalists[0].NAME);
      setname(name);

      setArticles(data);
    } catch (err) {
      setError("Failed to load articles. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategory = async () => {
    setIsLoading(true);
    setError("");
    try {
      const category = await gerArticlesWithCategory(params);
      setCategory(category);
    } catch (err) {
      setError("Failed to load articles. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  const handleView = (id) => navigate(`/articles/${id}`);

  const handleByJournalist = (id) => navigate(`/journalists/${id}/articles`);


  return (
    <>
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <div className="article-list">
        {articles.map((article) => (
          <ArticleCard
            key={article.id_a}
            article={article}
            onView={handleView}
            nameJ={nameJ}
            handleByJournalist={handleByJournalist}
            categorys={categorys}
          />
        ))}
      </div>
    </>
  );
}

function ArticleCard({ article, onView, nameJ, handleByJournalist, categorys}) {
  return (
    <div className="article-card">
      <div className="article-title">{article.title}</div>
      <div className="article-author" onClick={() => handleByJournalist(article.id_a)}>By {nameJ}</div>
      <div className="article-actions">
        <button className="button-secondary" onClick={() => onView(article.id_a)}>
          View
        </button>
      </div>

      <div className="article-action" style={{ marginTop: '5px'}}>
        {categorys.map((category) => (
          <button key={category.id_c} className="button-secondary" onClick={() => onView(article.id_a)}>
            {category.name_c}
          </button>
        ))}
      </div>
    
    </div>
  );
}
