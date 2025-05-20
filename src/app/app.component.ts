import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SubjectSelectionComponent } from './components/subject-selection/subject-selection.component';
import { LevelSelectionComponent } from './components/level-selection/level-selection.component';
import { LearningPlanComponent } from './components/learning-plan/learning-plan.component';
import { ChatComponent } from './components/chat/chat.component';
import { TutorService } from './services/tutor.service';
import { Subject } from './models/subject';
import { Level } from './models/level';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    SubjectSelectionComponent,
    LevelSelectionComponent,
    LearningPlanComponent,
    ChatComponent
  ],
  template: `
    <div class="app-container">
      <header>
        <h1>AI Virtual Tutor</h1>
        <p>Your personalized learning companion</p>
      </header>
      
      <main>
        <div class="setup-container" *ngIf="!showChat">
          <app-subject-selection
            *ngIf="!selectedSubject"
            (subjectSelected)="onSubjectSelected($event)">
          </app-subject-selection>
          
          <app-level-selection
            *ngIf="selectedSubject && !selectedLevel"
            [subject]="selectedSubject"
            (levelSelected)="onLevelSelected($event)">
          </app-level-selection>
          
          <app-learning-plan
            *ngIf="selectedSubject && selectedLevel"
            [subject]="selectedSubject"
            [level]="selectedLevel"
            (startChat)="startChat()">
          </app-learning-plan>
        </div>
        
        <app-chat
          *ngIf="showChat"
          [subject]="selectedSubject"
          [level]="selectedLevel"
          (backToLearningPlan)="showChat = false">
        </app-chat>
      </main>
      
      <footer>
        <p>© Made By Tejasvin Singh Dahiya ✌️ | Powered by Angular & Python AI</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }
    
    header {
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1.5rem;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    header h1 {
      margin: 0;
      font-size: 2.5rem;
      font-weight: bold;
    }
    
    header p {
      margin: 0.5rem 0 0;
      font-size: 1.2rem;
      opacity: 0.9;
    }
    
    main {
      flex: 1;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
    }
    
    footer {
      background-color: #2c3e50;
      color: white;
      text-align: center;
      padding: 1rem;
      margin-top: auto;
    }
  `]
})
export class AppComponent {
  title = 'ai-virtual-tutor';
  selectedSubject: Subject | null = null;
  selectedLevel: Level | null = null;
  showChat = false;

  constructor(private tutorService: TutorService) {}

  onSubjectSelected(subject: Subject): void {
    this.selectedSubject = subject;
    this.tutorService.selectSubject(subject);
  }

  onLevelSelected(level: Level): void {
    this.selectedLevel = level;
    this.tutorService.selectLevel(level);
    if (this.selectedSubject) {
      this.tutorService.getLearningPlan(this.selectedSubject.id, level).subscribe();
    }
  }

  startChat(): void {
    this.showChat = true;
  }
}