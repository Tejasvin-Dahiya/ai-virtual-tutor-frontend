import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from '../../models/subject';
import { Level } from '../../models/level';
import { ChatMessage } from '../../models/chat-message';
import { TutorService } from '../../services/tutor.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chat-container">
      <div class="chat-header">
        <button class="back-button" (click)="goBack()">← Back to Learning Plan</button>
        <div class="chat-title">
          <h2>AI Tutor Chat: {{ subject?.name }} ({{ capitalizeFirstLetter(level || '') }})</h2>
        </div>
        <button class="clear-chat" (click)="clearChat()">Clear Chat</button>
      </div>
      
      <div class="messages-container" #scrollContainer>
        <div *ngIf="messages.length === 0" class="welcome-message">
          <div class="tutor-avatar">🧠</div>
          <div class="welcome-content">
            <h3>Welcome to your AI Tutor session!</h3>
            <p>I'm here to help you learn {{ subject?.name }} at the {{ level }} level.</p>
            <p>Feel free to ask me questions about any topic in {{ subject?.name }}, request explanations, or ask for help with specific problems.</p>
          </div>
        </div>
        
        <div *ngFor="let message of messages" 
             class="message" 
             [ngClass]="{'user-message': message.sender === 'user', 'tutor-message': message.sender === 'tutor'}">
          <div *ngIf="message.sender === 'tutor'" class="tutor-avatar">🧠</div>
          <div class="message-content">
            <div class="message-text" [innerHTML]="formatMessage(message.content)"></div>
            <div class="message-timestamp">{{ message.timestamp | date:'shortTime' }}</div>
          </div>
          <div *ngIf="message.sender === 'user'" class="user-avatar">👤</div>
        </div>
      </div>
      
      <div class="input-container">
        <textarea 
          [(ngModel)]="userInput" 
          placeholder="Ask your AI tutor a question about this subject..." 
          (keydown.enter)="onEnterPress($event)"
          #messageInput></textarea>
        <button 
          [disabled]="!userInput.trim()" 
          (click)="sendMessage()"
          [ngClass]="{'btn-active': userInput.trim() !== ''}">
          Send
        </button>
      </div>
      
      <div class="suggestion-chips">
        <button class="suggestion-chip" (click)="usePrompt('Explain the fundamental concepts')">
          Explain fundamentals
        </button>
        <button class="suggestion-chip" (click)="usePrompt('Give me practice problems')">
          Practice problems
        </button>
        <button class="suggestion-chip" (click)="usePrompt('How is this applied in real life?')">
          Real-world applications
        </button>
        <button class="suggestion-chip" (click)="usePrompt('Explain like I am 5')">
          Simplify it
        </button>
      </div>
    </div>
  `,
  styles: [`
    .chat-container {
      display: flex;
      flex-direction: column;
      height: 70vh;
      background: white;
      border-radius: 1rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .chat-header {
      padding: 1rem 1.5rem;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .chat-title h2 {
      margin: 0;
      font-size: 1.3rem;
    }
    
    .back-button, .clear-chat {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      border-radius: 1.5rem;
      padding: 0.5rem 1rem;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .back-button:hover, .clear-chat:hover {
      background: rgba(255, 255, 255, 0.3);
    }
    
    .messages-container {
      flex: 1;
      padding: 1.5rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .welcome-message {
      display: flex;
      align-items: flex-start;
      background: #f8f9fb;
      border-radius: 1rem;
      padding: 1.5rem;
      margin-bottom: 1rem;
      animation: fadeIn 0.5s ease-in-out;
    }
    
    .welcome-content h3 {
      margin-top: 0;
      color: #2c3e50;
    }
    
    .message {
      display: flex;
      align-items: flex-start;
      gap: 0.8rem;
      max-width: 85%;
      animation: fadeIn 0.3s ease-in-out;
    }
    
    .user-message {
      align-self: flex-end;
      flex-direction: row-reverse;
    }
    
    .tutor-message {
      align-self: flex-start;
    }
    
    .message-content {
      background: #f8f9fb;
      padding: 1rem;
      border-radius: 1rem;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    }
    
    .user-message .message-content {
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    .message-text {
      margin-bottom: 0.5rem;
      line-height: 1.5;
    }
    
    .message-timestamp {
      font-size: 0.75rem;
      opacity: 0.7;
      text-align: right;
    }
    
    .tutor-avatar, .user-avatar {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    
    .tutor-avatar {
      background: #f4f6ff;
    }
    
    .user-avatar {
      background: #f0f2f5;
    }
    
    .input-container {
      padding: 1rem;
      display: flex;
      gap: 0.5rem;
      background: #f8f9fa;
      border-top: 1px solid #eaecef;
    }
    
    textarea {
      flex: 1;
      padding: 0.8rem 1rem;
      border: 1px solid #dfe1e5;
      border-radius: 1.5rem;
      resize: none;
      height: 2.5rem;
      transition: all 0.3s ease;
      font-family: inherit;
      font-size: 1rem;
    }
    
    textarea:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
      height: 5rem;
    }
    
    button {
      padding: 0 1.5rem;
      background: #e0e0e0;
      color: #757575;
      border: none;
      border-radius: 1.5rem;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    button.btn-active {
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    button.btn-active:hover {
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
    }
    
    .suggestion-chips {
      padding: 0.5rem 1rem 1rem;
      display: flex;
      gap: 0.5rem;
      overflow-x: auto;
      flex-wrap: wrap;
      justify-content: center;
    }
    
    .suggestion-chip {
      background: #f0f2f5;
      color: #4b5563;
      padding: 0.5rem 1rem;
      border-radius: 1.5rem;
      font-size: 0.85rem;
      white-space: nowrap;
      transition: all 0.3s ease;
    }
    
    .suggestion-chip:hover {
      background: #e0e7ff;
      color: #4f46e5;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @Input() subject: Subject | null = null;
  @Input() level: Level | null = null;
  @Output() backToLearningPlan = new EventEmitter<void>();
  
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  @ViewChild('messageInput') private messageInput!: ElementRef;
  
  messages: ChatMessage[] = [];
  userInput: string = '';
  isLoading: boolean = false;
  
  constructor(private tutorService: TutorService) {}
  
  ngOnInit(): void {
    this.tutorService.chatMessages$.subscribe(messages => {
      this.messages = messages;
    });
  }
  
  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }
  
  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) {}
  }
  
  sendMessage(): void {
    const content = this.userInput.trim();
    if (content && !this.isLoading) {
      this.isLoading = true;
      this.userInput = '';
      setTimeout(() => this.messageInput.nativeElement.focus(), 0);
      
      this.tutorService.sendMessage(content).subscribe({
        next: () => this.isLoading = false,
        error: () => this.isLoading = false
      });
    }
  }
  
  onEnterPress(event: any): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
  
  clearChat(): void {
    this.tutorService.clearChat();
  }
  
  goBack(): void {
    this.backToLearningPlan.emit();
  }
  
  usePrompt(prompt: string): void {
    this.userInput = prompt;
    setTimeout(() => this.messageInput.nativeElement.focus(), 0);
  }
  
  capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  formatMessage(text: string): string {
    // Basic markdown parsing for code blocks, bold, italic, etc.
    let formattedText = text
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Lists
      .replace(/^- (.*?)$/gm, '• $1')
      // Line breaks
      .replace(/\n/g, '<br>');
    
    return formattedText;
  }
}
