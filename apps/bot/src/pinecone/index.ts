import { IndexModel } from '@pinecone-database/pinecone';
import { getPineconeClient } from './client';

export class PineconeService {
  private static instance: PineconeService;
  private indexName = 'memomate-contacts';
  private dimension = 1024; // Dimensión del modelo multilingual-e5-large

  private constructor() {}

  static getInstance(): PineconeService {
    if (!PineconeService.instance) {
      PineconeService.instance = new PineconeService();
    }
    return PineconeService.instance;
  }

  async init() {
    try {
      const pinecone = getPineconeClient();
      
      // Verificar si el índice existe
      const existingIndexes = await pinecone.listIndexes();
      
      const indexExists = existingIndexes?.indexes?.some(
        (index: IndexModel) => index.name === this.indexName
      );
      
      if (!indexExists) {
        // Crear el índice si no existe
        await pinecone.createIndex({
          name: this.indexName,
          dimension: this.dimension,
          metric: 'cosine',
          spec: {
            serverless: {
              cloud: 'aws',
              region: 'us-east-1'
            }
          },
        });
        
        console.log('Índice de Pinecone creado correctamente');
      }
    } catch (error) {
      console.error('Error al inicializar Pinecone:', error);
      throw error;
    }
  }

  async upsertContact(userId: string, contactId: string, embedding: number[]) {
    try {
      const pinecone = getPineconeClient();
      const index = pinecone.index(this.indexName);

      await index.upsert([{
        id: contactId,
        values: embedding,
        metadata: {
          userId
        }
      }]);

      return true;
    } catch (error) {
      console.error('Error al insertar contacto en Pinecone:', error);
      return false;
    }
  }

  async searchSimilarContacts(userId: string, queryEmbedding: number[], limit: number = 5) {
    try {
      const pinecone = getPineconeClient();
      const index = pinecone.index(this.indexName);

      const results = await index.query({
        vector: queryEmbedding,
        filter: {
          userId: userId
        },
        topK: limit,
        includeMetadata: true
      });

      return results.matches;
    } catch (error) {
      console.error('Error al buscar contactos similares:', error);
      return [];
    }
  }
}

export default PineconeService; 