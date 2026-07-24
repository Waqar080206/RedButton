from functools import lru_cache

from qdrant_client import QdrantClient, models

from config import QDRANT_COLLECTION, QDRANT_DIR, RETRIEVAL_TOP_K


@lru_cache
def get_qdrant_client() -> QdrantClient:
    return QdrantClient(path=str(QDRANT_DIR))


def retrieve_chunks(question: str, machine_id: str | None = None, limit: int = RETRIEVAL_TOP_K):
    client = get_qdrant_client()
    if QDRANT_COLLECTION not in [c.name for c in client.get_collections().collections]:
        return []

    query_filter = None
    if machine_id:
        query_filter = models.Filter(
            must=[models.FieldCondition(key="machine_id", match=models.MatchValue(value=machine_id))]
        )

    results = client.query(
        collection_name=QDRANT_COLLECTION,
        query_text=question,
        query_filter=query_filter,
        limit=limit,
    )
    return results
