import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Subject } from '../models/subject';
import { Level } from '../models/level';
import { LearningPlan } from '../models/learning-path';
import { ChatMessage } from '../models/chat-message';

@Injectable({
  providedIn: 'root'
})
export class TutorService {
  private apiUrl = 'http://localhost:8004/api'; // Your Python backend URL
  private currentSubjectSource = new BehaviorSubject<Subject | null>(null);
  private currentLevelSource = new BehaviorSubject<Level | null>(null);
  private LearningPlanSource = new BehaviorSubject<LearningPlan | null>(null);
  private chatMessagesSource = new BehaviorSubject<ChatMessage[]>([]);

  currentSubject$ = this.currentSubjectSource.asObservable();
  currentLevel$ = this.currentLevelSource.asObservable();
  LearningPlan$ = this.LearningPlanSource.asObservable();
  chatMessages$ = this.chatMessagesSource.asObservable();

  constructor(private http: HttpClient) { }

  getSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${this.apiUrl}/subjects`).pipe(
      catchError(this.handleError<Subject[]>('getSubjects', []))
    );
  }

  selectSubject(subject: Subject): void {
    this.currentSubjectSource.next(subject);
  }

  selectLevel(level: Level): void {
    this.currentLevelSource.next(level);
  }

  getLearningPlan(subjectId: number, level: Level): Observable<LearningPlan> {
    return this.http.get<LearningPlan>(`${this.apiUrl}/learning-plan/${subjectId}/${level}`).pipe(
      tap(plan => this.LearningPlanSource.next(plan)),
      catchError(this.handleError<LearningPlan>('getLearningPlan'))
    );
  }

  sendMessage(content: string): Observable<ChatMessage> {
    const message: Partial<ChatMessage> = {
      sender: 'user',
      content,
      timestamp: new Date()
    };
    
    return this.http.post<ChatMessage>(`${this.apiUrl}/chat`, message).pipe(
      tap(responseMsg => {
        const messages = this.chatMessagesSource.value;
      
        messages.push({
          id: messages.length,
          sender: 'user',
          content,
          timestamp: new Date()
        });
        messages.push(responseMsg);
        this.chatMessagesSource.next([...messages]);
      }),
      catchError(this.handleError<ChatMessage>('sendMessage'))
    );
  }

  clearChat(): void {
    this.chatMessagesSource.next([]);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result
      return of(result as T);
    };
  }
}