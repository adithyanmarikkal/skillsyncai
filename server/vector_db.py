from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct
import uuid

client = QdrantClient(":memory:") 

COLLECTION_NAME = "resumes"

def create_collection(vector_size):
    client.recreate_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(
            size=vector_size,
            distance=Distance.COSINE
        ),
    )

def store_embedding(embedding, text_chunk):
    client.upsert(
        collection_name=COLLECTION_NAME,
        points=[
            PointStruct(
                id=str(uuid.uuid4()),
                vector=embedding,
                payload={"text": text_chunk}
            )
        ]
    )

def search_similar(query_embedding, limit=5):
    results = client.query_points(
        collection_name=COLLECTION_NAME,
        query=query_embedding,
        limit=limit
    )
    return results