//
// This repository shall:
// - Connect to the database (using the pool provided by the database.js)
// - Perform the PostgreSQL queries to implement the below API

import { pool } from '../utils/database.js'; // Assuming your database.js now configures a pg pool

// Get all articles
export async function getArticles() {
    try {
        const result = await pool.query('SELECT * FROM articles');
        return result.rows;
    } catch (error) {
        console.error('Error fetching articles:', error);
        throw error;
    }
}

// Get one article by ID
export async function getArticleById(id) {
    try {
        const result = await pool.query('SELECT * FROM articles WHERE id_a = $1', [id]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching article by ID:', error); // Changed error message for clarity
        throw error;
    }
}

// Create a new article
export async function createArticle(article) {
    try {
        const { title, content, journalist, category } = article;
        const result = await pool.query(
            'INSERT INTO articles(title, content, journalistid, category) VALUES ($1, $2, $3, $4) RETURNING id_a',
            [title, content, journalist, category]
        );
        return { id: result.rows[0].id_a, ...article };
    } catch (error) {
        console.error('Error creating article:', error);
        throw error;
    }
}

// Update an article by ID
export async function updateArticle(id, updatedData) {
    try {
        const { title, content, journalist, category } = updatedData;
        const result = await pool.query(
            'UPDATE articles SET title = $1, content = $2, journalistid = $3, category = $4 WHERE id_a = $5',
            [title, content, journalist, category, id]
        );
        if (result.rowCount === 0) {
            return null;
        }
        return { id, ...updatedData };
    } catch (error) {
        console.error('Error updating article:', error);
        throw error;
    }
}

// Delete an article by ID
export async function deleteArticle(id) {
    try {
        const result = await pool.query('DELETE FROM articles WHERE id_a = $1', [id]);
        return result.rowCount > 0;
    } catch (error) {
        console.error('Error deleting article:', error);
        throw error;
    }
}

export async function ArticlesWithJournalists(id) {
    try {
        const result = await pool.query(`
            SELECT * FROM articles a JOIN journalists j ON a.journalistid = j.id WHERE j.id = $1`, [id]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching articles with journalists:', error); // Changed error message
        throw error;
    }
}

export async function getAllArticlesWithJournalists() {
    try {
        const result = await pool.query(`
            SELECT * FROM journalists`); // This query only selects journalists, not articles *with* journalists
        return result.rows;
    } catch (error) {
        console.error('Error fetching all journalists:', error); // Changed error message
        throw error;
    }
}

export async function getAllArticlesWithcategory(id) {
    try {
        const result = await pool.query(`
            SELECT c.id_c as id_c, c.name_c as name_c, cd.id_a as id_a FROM category c JOIN categorydetail cd ON cd.id_c = c.id_c WHERE cd.id_a = $1`, [id]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching articles with category:', error); // Changed error message
        throw error;
    }
}