import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from '../../models/subject';
import { Level } from '../../models/level';
import { LearningPlan, LearningModule } from '../../models/learning-path';
import { TutorService } from '../../services/tutor.service';

@Component({
  selector: 'app-learning-plan',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="learning-plan">
      <h2>Your {{ selectedLevel }} Learning Path for {{ subject?.name }}</h2>
      
      <div *ngIf="learningPlan" class="plan-details">
        <p class="plan-intro">Follow this personalized learning plan to master {{ subject?.name }} at your pace.</p>
        
        <div class="modules">
          <div *ngFor="let module of learningPlan.modules; let i = index" class="module-card">
            <div class="module-header">
              <span class="module-number">{{ i + 1 }}</span>
              <h3>{{ module.title }}</h3>
            </div>
            <p class="module-description">{{ module.description }}</p>
            <div class="module-details">
              <div class="time"><span>⏱️</span> {{ module.estimatedTime }}</div>
              <div class="resources">
                <h4>Resources:</h4>
                <ul>
                  <li *ngFor="let resource of module.resources">{{ resource }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div class="actions">
          <button class="start-chat-btn" (click)="onStartChat()">Start Learning with AI Tutor</button>
          <button class="change-options-btn" (click)="goBack()">Change Options</button>
        </div>
      </div>
      
      <div *ngIf="!learningPlan" class="loading">
        <p>Generating your personalized learning plan...</p>
        <div class="spinner"></div>
      </div>
    </div>
  `,
  styles: [`
    .learning-plan {
      padding: 2rem 0;
    }
    
    h2 {
      font-size: 2rem;
      color: #2c3e50;
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .plan-details {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .plan-intro {
      text-align: center;
      font-size: 1.2rem;
      color: #34495e;
      margin-bottom: 2rem;
    }
    
    .modules {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .module-card {
      background: white;
      border-radius: 1rem;
      padding: 1.5rem;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }
    
    .module-card:hover {
      transform: translateY(-5px);
    }
    
    .module-header {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
    }
    
    .module-number {
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      color: white;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      margin-right: 1rem;
    }
    
    .module-card h3 {
      font-size: 1.3rem;
      color: #2c3e50;
      margin: 0;
    }
    
    .module-description {
      color: #7f8c8d;
      margin-bottom: 1rem;
    }
    
    .module-details {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }
    
    .time {
      background: #f8f9fa;
      padding: 0.5rem 1rem;
      border-radius: 2rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
    }
    
    .resources {
      flex: 1;
    }
    
    .resources h4 {
      font-size: 1rem;
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
    }
    
    .resources ul {
      margin: 0;
      padding-left: 1.5rem;
      color: #34495e;
    }
    
    .actions {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      margin-top: 2rem;
    }
    
    .start-chat-btn {
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 2rem;
      font-size: 1.1rem;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }
    
    .start-chat-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.6);
    }
    
    .change-options-btn {
      background: none;
      border: none;
      color: #3498db;
      cursor: pointer;
      font-size: 1rem;
      padding: 0.5rem;
      transition: all 0.3s ease;
    }
    
    .change-options-btn:hover {
      color: #2980b9;
      text-decoration: underline;
    }
    
    .loading {
      text-align: center;
      padding: 3rem 0;
    }
    
    .spinner {
      width: 3rem;
      height: 3rem;
      border: 5px solid rgba(102, 126, 234, 0.3);
      border-radius: 50%;
      border-top-color: #667eea;
      animation: spin 1s ease-in-out infinite;
      margin: 2rem auto;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class LearningPlanComponent implements OnInit {
  @Input() subject: Subject | null = null;
  @Input() level: Level | null = null;
  @Output() startChat = new EventEmitter<void>();
  @Output() goBackEvent = new EventEmitter<void>();
  
  learningPlan: LearningPlan | null = null;
  selectedLevel: string = '';
  
  constructor(private tutorService: TutorService) {}
  
  ngOnInit(): void {
    if (this.level) {
      this.selectedLevel = this.capitalizeFirstLetter(this.level);
    }
    
    this.tutorService.LearningPlan$.subscribe(plan => {
      this.learningPlan = plan;
    });
  }
  
  capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  onStartChat(): void {
    this.startChat.emit();
  }
  
  goBack(): void {
    this.goBackEvent.emit();
  }
}