import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    standalone: false
})
export class SearchComponent {
  query: string = '';
  results: any[] = [];
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  searchFAQ() {
    if (!this.query.trim()) return;
    this.loading = true;
    this.http.post<any[]>('http://127.0.0.1:8000/api/search', { text: this.query })
      .subscribe({
        next: (res) => {
          this.results = res;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
  }
  resetSearch()
  {
    this.query = '';
    this.results = [];
    this.loading = false;
  }
}
