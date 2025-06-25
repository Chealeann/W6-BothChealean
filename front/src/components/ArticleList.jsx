import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getArticles, removeArticle, getArticlesWithJournalists, getallArticlesWithJournalists } from "../services/api";

//
// ArticleList component
//
export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [nameJ, setname] = useState("");
  const [listJ, setListJ] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles(); // Fetch all articles when component mounts
  }, []);

  useEffect(() => {
    if (nameJ) {
      console.log("Name has been updated to:", nameJ);
    }
  }, [nameJ]);

  useEffect(() => {
    if (listJ) {
      console.log("list", listJ);
    }
  }, [listJ]);

  const fetchArticles = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getArticles();
      const datajournalists = await getArticlesWithJournalists(data[0].journalistid);
      const allJournalists = await getallArticlesWithJournalists();
      const journalistMap = {};
      allJournalists.forEach(j => {
        setListJ((prev) => ({
          ...prev,
          [j.id]: j.NAME
      }));
        console.log("j:", j);
      });
      console.log("listJ:", listJ);
      const name = String(datajournalists[0].NAME);
      setname(name);

      setArticles(data);
    } catch (err) {
      setError("Failed to load articles. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteArticle = async (id) => {
    setIsLoading(true);
    setError("");
    try {
      await removeArticle(id);
      await fetchArticles(); // refresh the list
    } catch (err) {
      setError("Failed to delete article.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (id) => navigate(`/articles/${id}`);

  const handleEdit = (id) => navigate(`/articles/${id}/edit`);

  const handleByJournalist = (id) => navigate(`/journalists/${id}/articles`);

  const checkIfJournalist = (id) => {
    if (listJ && listJ[id]) {
      return listJ[id];
    }
    return "Unknown Journalist";
  };

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
            onEdit={handleEdit}
            onDelete={deleteArticle}
            nameJ={nameJ}
            handleByJournalist={handleByJournalist}
            journalistid={article.journalistid}
            checkIfJournalist={checkIfJournalist}
          />
        ))}
      </div>
    </>
  );
}

function ArticleCard({ article, onView, onEdit, onDelete, nameJ, handleByJournalist, journalistid, checkIfJournalist}) {
  return (
    <div className="article-card">
      <div className="article-title">{article.title}</div>
      <div className="article-author" onClick={() => handleByJournalist(journalistid)}>By {checkIfJournalist(journalistid)}</div>

      <div className="article-actions">
        <button className="button-tertiary" onClick={() => onEdit(article.id_a)}>
          Edit
        </button>
        <button
          className="button-tertiary"
          onClick={() => onDelete(article.id_a)}
        >
          Delete
        </button>
        <button className="button-secondary" onClick={() => onView(article.id_a)}>
          View
        </button>
      </div>
    </div>
  );
}
