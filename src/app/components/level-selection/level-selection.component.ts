import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from '../../models/subject';
import { Level } from '../../models/level';

@Component({
  selector: 'app-level-selection',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="level-selection">
      <h2>Select Your Experience Level</h2>
      <p>For {{ subject?.name }}</p>
      
      <div class="levels-container">
        <div class="level-card beginner" 
             [class.active]="hoveredLevel === 'beginner'"
             (mouseenter)="hoveredLevel = 'beginner'"
             (mouseleave)="hoveredLevel = null"
             (click)="selectLevel('beginner')">
          <div class="level-icon">🌱</div>
          <h3>Beginner</h3>
          <p>New to {{ subject?.name }}? Start here with fundamental concepts.</p>
        </div>
        
        <div class="level-card intermediate"
             [class.active]="hoveredLevel === 'intermediate'"
             (mouseenter)="hoveredLevel = 'intermediate'"
             (mouseleave)="hoveredLevel = null" 
             (click)="selectLevel('intermediate')">
          <div class="level-icon">🌿</div>
          <h3>Intermediate</h3>
          <p>Build on basics with more advanced {{ subject?.name }} topics.</p>
        </div>
        
        <div class="level-card advanced"
             [class.active]="hoveredLevel === 'advanced'"
             (mouseenter)="hoveredLevel = 'advanced'"
             (mouseleave)="hoveredLevel = null"
             (click)="selectLevel('advanced')">
          <div class="level-icon">🌳</div>
          <h3>Advanced</h3>
          <p>Deep dive into complex {{ subject?.name }} concepts and applications.</p>
        </div>
      </div>
      
      <button class="back-button" (click)="goBack()">← Choose Different Subject</button>
    </div>
  `,
  styles: [`
    .level-selection {
      text-align: center;
      padding: 2rem 0;
    }
    
    h2 {
      font-size: 2rem;
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }
    
    .levels-container {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin: 3rem 0;
      flex-wrap: wrap;
    }
    
    .level-card {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      width: 280px;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .level-card:hover {
      transform: translateY(-10px);
    }
    
    .level-card.active {
      transform: translateY(-10px);
    }
    
    .level-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    
    .level-card h3 {
      font-size: 1.5rem;
      margin: 0.5rem 0;
      color: #2c3e50;
    }
    
    .level-card p {
      color: #7f8c8d;
    }
    
    .beginner {
      border-top: 5px solid #2ecc71;
    }
    
    .beginner:hover, .beginner.active {
      box-shadow: 0 15px 30px rgba(46, 204, 113, 0.3);
    }
    
    .intermediate {
      border-top: 5px solid #3498db;
    }
    
    .intermediate:hover, .intermediate.active {
      box-shadow: 0 15px 30px rgba(52, 152, 219, 0.3);
    }
    
    .advanced {
      border-top: 5px solid #9b59b6;
    }
    
    .advanced:hover, .advanced.active {
      box-shadow: 0 15px 30px rgba(155, 89, 182, 0.3);
    }
    
    .back-button {
      background: none;
      border: none;
      color: #3498db;
      cursor: pointer;
      font-size: 1rem;
      padding: 0.5rem 1rem;
      margin-top: 2rem;
      transition: all 0.3s ease;
    }
    
    .back-button:hover {
      color: #2980b9;
      text-decoration: underline;
    }
  `]
})
export class LevelSelectionComponent {
  @Input() subject: Subject | null = null;
  @Output() levelSelected = new EventEmitter<Level>();
  @Output() goBackEvent = new EventEmitter<void>();
  
  hoveredLevel: Level | null = null;
  
  selectLevel(level: Level): void {
    this.levelSelected.emit(level);
  }
  
  goBack(): void {
    this.goBackEvent.emit();
  }
}