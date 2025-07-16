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
  noResults: boolean = false;
  suggestions: string[] = [];
  allResults: any[] = [];
  selectedTag: string = 'All';

  constructor(private http: HttpClient) {}

  searchFAQ() {
    if (!this.query.trim()) return;
    this.loading = true;
    this.noResults = false;
    this.http.post<any[]>('http://127.0.0.1:8000/api/search', { text: this.query })
      .subscribe({
        next: (res) => {
          const lowerQuery = this.query.toLowerCase();
          this.results = res.filter((item, index, self) =>
            (item.title.toLowerCase().includes(lowerQuery) ||
             item.body.toLowerCase().includes(lowerQuery)) &&
            index === self.findIndex(t => t.title === item.title && t.body === item.body)
          );
          this.noResults = this.results.length === 0;
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
  filterByTag(tag: string) {
    this.selectedTag = tag;
    if (tag === 'All') {
      this.results = [...this.allResults];
    } else {
      this.results = this.allResults.filter(r => r.tags && r.tags.includes(tag));
    }
  }

  getUniqueTags(): string[] {
    const tagSet = new Set<string>();
    this.allResults.forEach(r => r.tags?.forEach((t: string) => tagSet.add(t)));
    return ['All', ...Array.from(tagSet)];
  }
}
