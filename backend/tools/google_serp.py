import os
from serpapi import GoogleSearch

def get_google_search(query: str):
    """
    Connects to SerpApi to fetch real-world search results.
    """
    params = {
        "q": query,
        "location": "United States",
        "hl": "en",
        "gl": "us",
        "google_domain": "google.com",
        "api_key": os.getenv("SERP_API_KEY")
    }
    
    search = GoogleSearch(params)
    results = search.get_dict()
    
    # Extract only relevant organic snippets to keep the context clean
    organic_results = results.get("organic_results", [])
    snippets = [
        f"Title: {res.get('title')}\nSnippet: {res.get('snippet')}\nLink: {res.get('link')}"
        for res in organic_results[:3] # Top 3 results are usually enough
    ]
    
    return "\n\n".join(snippets) if snippets else "No real-time data found."