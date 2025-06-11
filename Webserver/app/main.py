import os
from fastapi import FastAPI, Query, HTTPException
from databases import Database
from dotenv import load_dotenv
import tiktoken
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL not set in .env")

database = Database(DATABASE_URL)
app = FastAPI(title="Magnifit Search API")



app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# Load tokenizer (OpenAI GPT-4 tokenizer base)
tokenizer = tiktoken.get_encoding("cl100k_base")


@app.on_event("startup")
async def startup():
    await database.connect()


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()


@app.get("/search")
async def search(
    q: str = Query(..., min_length=1, description="Search query"),
    limit: int = Query(10, gt=0, le=100, description="Max number of results"),
):
    # Tokenize the query string using tiktoken
    token_ids = tokenizer.encode(q)
    tokens = [tokenizer.decode([tid]).strip() for tid in token_ids if tokenizer.decode([tid]).strip()]

    if not tokens:
        raise HTTPException(status_code=400, detail="No valid tokens found in query.")

    # Prepare SQL query - match tokens case-insensitive by lowercasing token strings and DB tokens
    query = """
    SELECT urls.url, COALESCE(SUM(u.count), 0) as rating
    FROM urls
    JOIN usage u ON urls.id = u.url
    JOIN tokens t ON u.token = t.id
    WHERE LOWER(t.token) = ANY(:tokens)
    GROUP BY urls.url
    ORDER BY rating DESC
    LIMIT :limit;
    """

    # Lowercase tokens for case-insensitive match
    tokens_lower = [t.lower() for t in tokens]

    values = {"tokens": tokens_lower, "limit": limit}

    results = await database.fetch_all(query=query, values=values)

    response = [{"url": r["url"], "rating": r["rating"]} for r in results]

    return {"results": response}
