import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from '../../models/subject';
import { TutorService } from '../../services/tutor.service';

@Component({
  selector: 'app-subject-selection',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="subject-selection">
      <h2>Choose a Subject</h2>
      <p>Select a subject that you'd like to learn about</p>
      
      <div class="subjects-grid">
        <div *ngFor="let subject of subjects" 
             class="subject-card"
             (click)="selectSubject(subject)"
             [class.pulse]="hoveredSubject === subject.id"
             (mouseenter)="hoveredSubject = subject.id"
             (mouseleave)="hoveredSubject = null">
          <div class="subject-icon" [innerHTML]="subject.icon"></div>
          <h3>{{ subject.name }}</h3>
          <p>{{ subject.description }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .subject-selection {
      text-align: center;
      padding: 2rem 0;
    }
    
    h2 {
      font-size: 2rem;
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }
    
    .subjects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }
    
    .subject-card {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .subject-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
    }
    
    .subject-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      color: #667eea;
    }
    
    .subject-card h3 {
      font-size: 1.5rem;
      margin: 0.5rem 0;
      color: #2c3e50;
    }
    
    .subject-card p {
      color: #7f8c8d;
      margin-top: 0.5rem;
    }
    
    .pulse {
      animation: pulse 1.5s infinite;
    }
    
    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7);
      }
      70% {
        box-shadow: 0 0 0 10px rgba(102, 126, 234, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(102, 126, 234, 0);
      }
    }
  `]
})
export class SubjectSelectionComponent implements OnInit {
  subjects: Subject[] = [];
  hoveredSubject: number | null = null;
  
  @Output() subjectSelected = new EventEmitter<Subject>();
  
  constructor(private tutorService: TutorService) {}
  
  ngOnInit(): void {
    this.loadSubjects();
  }
  
  loadSubjects(): void {
    this.tutorService.getSubjects().subscribe(subjects => {
      this.subjects = subjects;
    });
  }
  
  selectSubject(subject: Subject): void {
    this.subjectSelected.emit(subject);
  }
}