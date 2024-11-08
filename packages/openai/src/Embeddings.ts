import { openaiClient } from ".";

export class Embeddings {
  private model = 'text-embedding-3-small';
  private dimensions = 1024;

  constructor() {}

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await openaiClient.embeddings.create({
        model: this.model,
        dimensions: this.dimensions,
        input: text,
        encoding_format: 'float'
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error('Error al generar embedding:', error);
      throw error;
    }
  }
}