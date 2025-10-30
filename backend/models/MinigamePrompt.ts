export interface MinigamePrompt {
  id: string;
  text: string;
  guessText?: string;
  resultText?: string;
  variables?: { [key: string]: string };
  category?: string;
  difficulty?: string;
  language?: string;
  imageUrl?: string;
  promptData?: any;
}
