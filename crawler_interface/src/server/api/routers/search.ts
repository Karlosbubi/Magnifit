import { z } from "zod";
import { Pool } from "pg";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env";

// Dynamic import for tiktoken to handle WASM loading properly
async function getTokenizer() {
	const { encoding_for_model } = await import("tiktoken");
	return encoding_for_model("gpt-4o");
}

// Define the search result interface
interface SearchResult {
	id: string;
	title: string;
	url: string;
	description: string;
}

export const searchRouter = createTRPCRouter({
	// Function that takes a string and returns status information
	addToIndex: publicProcedure
		.input(z.string().url())
		.mutation(async ({ input }) => {
			// Create a connection pool
			const pool = new Pool({
				connectionString: env.DB_CONNECTION,
			});

			try {
				// First check if URL already exists
				const existingUrl = await pool.query(
					'SELECT url, last_check FROM urls WHERE url = $1',
					[input]
				);

				if (existingUrl.rows.length > 0) {
					const lastChecked = existingUrl.rows[0]?.last_checked;
					const lastCheckedStr = lastChecked 
						? new Date(lastChecked).toLocaleString()
						: 'Never';
					
					return {
						alreadyExists: true,
						message: `This URL was already added to the crawl queue. Last checked: ${lastCheckedStr}`,
					};
				}

				// Insert the URL into the urls table
				await pool.query(
					'INSERT INTO urls (url) VALUES ($1)',
					[input]
				);
				
				console.log(`Added URL to crawl queue: ${input}`);
				return {
					alreadyExists: false,
					message: 'URL successfully added to crawl queue!',
				};
			} catch (error) {
				console.error('Error adding URL to database:', error);
				throw new Error('Failed to add URL to crawl queue');
			} finally {
				// Close the pool
				await pool.end();
			}
		}),

	// Function that takes a string and returns a list of results
	search: publicProcedure
		.input(z.string())
		.query(async ({ input }) => {
			// Tokenize the search query using tiktoken with gpt-4o model
			const tokenizer = await getTokenizer();
			
			// Tokenize the input and get unique tokens
			const tokenIds = tokenizer.encode(input);
			const uniqueTokenIds = [...new Set(tokenIds)];
			
			// Decode tokens back to strings for database search
			const tokens = uniqueTokenIds.map(tokenId => tokenizer.decode(new Uint32Array([tokenId])));
			
			console.log(`Searching for tokens: ${tokens.join(', ')}`);
			
			// Create a connection pool
			const pool = new Pool({
				connectionString: env.DB_CONNECTION,
			});

			try {
				// Search the database using the tokenized query
				const query = `
					SELECT
						urls.url,
						urls.title,
						SUM(u.count) AS token_count,
						COUNT(DISTINCT t.token) AS unique_token_count
					FROM
						urls
					JOIN
						usage AS u ON urls.id = u.url
					JOIN
						tokens AS t ON u.token = t.id
					WHERE
						t.token = ANY($1)
					GROUP BY
						urls.url, urls.title
					ORDER BY
						unique_token_count DESC,
						token_count DESC
					LIMIT $2
				`;
				
				const limit = 20; // Default limit
				const result = await pool.query(query, [tokens, limit]);
				
				// Transform database results to SearchResult format
				const searchResults: SearchResult[] = result.rows.map(row => {
					// Create a better title from URL if title is not available
					const urlTitle = row.title || 
						new URL(row.url).hostname.replace('www.', '') + 
						(new URL(row.url).pathname !== '/' ? new URL(row.url).pathname : '');
					
					return {
						id: row.url, // Using URL as ID since it's unique
						title: urlTitle,
						url: row.url,
						description: `Found ${row.unique_token_count} matching tokens (${row.token_count} total occurrences)`,
					};
				});
				
				return searchResults;
			} catch (error) {
				console.error('Error searching database:', error);
				throw new Error('Failed to search database');
			} finally {
				// Close the pool
				await pool.end();
			}
		}),
});