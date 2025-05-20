export interface ChatMessage {
    id: number;
    sender: 'user' | 'tutor';
    content: string;
    timestamp: Date;
  }