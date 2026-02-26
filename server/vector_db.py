from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct
import uuid

client = QdrantClient(":memory:")

COLLECTION_NAME = "resumes"


def create_collection(vector_size):
    client.recreate_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(size=vector_size, distance=Distance.COSINE),
    )


def store_embedding(embedding, text_chunk):
    client.upsert(
        collection_name=COLLECTION_NAME,
        points=[
            PointStruct(
                id=str(uuid.uuid4()), vector=embedding, payload={"text": text_chunk}
            )
        ],
    )


def search_similar(query_embedding, limit=5):
    results = client.query_points(
        collection_name=COLLECTION_NAME, query=query_embedding, limit=limit
    )
    return results


SCORE_THRESHOLD = 0.55


def search_skill(query_embedding, threshold=SCORE_THRESHOLD):
    """Search across top-5 resume chunks and take the best match score.
    A skill keyword matches if ANY chunk scores above the threshold."""
    results = client.query_points(
        collection_name=COLLECTION_NAME, query=query_embedding, limit=5
    )
    if results.points:
        best_score = max(p.score for p in results.points)
        return best_score >= threshold, best_score
    return False, 0.0


def get_all_resume_text() -> str:
    """Return all stored resume chunk texts joined into one string for keyword lookup."""
    try:
        results, _ = client.scroll(
            collection_name=COLLECTION_NAME,
            limit=1000,
            with_payload=True,
            with_vectors=False,
        )
        return " ".join(p.payload.get("text", "") for p in results)
    except Exception:
        return ""
