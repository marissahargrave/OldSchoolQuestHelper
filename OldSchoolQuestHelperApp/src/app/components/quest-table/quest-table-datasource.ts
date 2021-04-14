import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { OldSchoolService } from '../../Utils/OldSchoolService';

export interface QuestTableItem {
  index: number;
  title: string;
  status: boolean;
  difficulty: string;
  members: boolean;
  length: string;
  questPoints: number;
  userEligible: boolean;
  series: string;
}

/**
 * Data source for the QuestTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class QuestTableDataSource extends DataSource<QuestTableItem> {
  data: QuestTableItem[] = [];
  ObservableData!: Observable<QuestTableItem[]>;
  paginator!: MatPaginator;
  sort!: MatSort;
  private osrsQuestURL: string = "http://localhost:8124";
  private osrsQuestListPath: string = "/questList";
  private osrsUserStatPath: string = "/user"


  constructor(private http:HttpClient) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<QuestTableItem[]> {
    this.ObservableData = new OldSchoolService(this.http).getQuestList(); //.pipe(map(res=> this.data));

    const dataMutations = [
      this.ObservableData,
      this.paginator.page,
      this.sort.sortChange
    ];

    return merge(...dataMutations).pipe(map(res => {
      this.data = res;
      return this.getPagedData(this.getSortedData([...this.data]));
    }));
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: QuestTableItem[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: QuestTableItem[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'questPoints': return compare(a.questPoints, b.questPoints, isAsc);
        case 'title': return compare(a.title, b.title, isAsc);
        case 'difficulty': return compare(+a.difficulty, +b.difficulty, isAsc);
        default: return 0;
      }
    });
  }

  public markEligible(username: string): void{
    
  }
}


/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}


