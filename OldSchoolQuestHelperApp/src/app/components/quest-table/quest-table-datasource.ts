import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

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

export interface questResponse{
  raw: string;
}

/**
 * Data source for the QuestTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class QuestTableDataSource extends DataSource<QuestTableItem> {
  data: QuestTableItem[] = [];
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
    const headers = new HttpHeaders({ 'responseType': 'text', 'content-type': 'text/html' });
      
    console.log("SENDNG REQUEST");
      
    this.http.get(this.osrsQuestURL+this.osrsQuestListPath).subscribe( 
      {next: data =>
        {     
              var responseData = <questResponse>data;
              console.log("RESPONSE RECEIVED");
              console.log(data);
              this.convertDom(responseData.raw); 
        },
      error: error => { console.log(error)}
      }

      );
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      observableOf(this.data),
      this.paginator.page,
      this.sort.sortChange
    ];

    return merge(...dataMutations).pipe(map(() => {
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

  private convertDom(questDom: string): void{
    console.log("CONVERT DOM");
      var wrapper = document.createElement("div");
      wrapper.id = "wrapper";
      wrapper.innerHTML = questDom;
      var tables: any = wrapper.getElementsByClassName("wikitable");
      //var questEntriesHTML: HTMLCollection[] = [];
      var questEntries: QuestTableItem[] = [];
      //There's no class name we're getting back that makes these quest tables unique,
      //If they change the order of tables, this will need to be updated
      var index: number = 0;
      for(let table of tables){
          if(index === 1 || index === 3){
            for(let row of table.getElementsByTagName("tr")){
                var quest:QuestTableItem;
                var questData: string[] = [];
                for(let data of row.getElementsByTagName("td")){
                  questData.push(data.innerText.replace('\n', ''));
                }
                if(questData.length){
                  quest = {
                      index: parseInt(questData[0]),
                      title: questData[1],
                      difficulty: questData[2],
                      members: (index===3),
                      length: questData[3],
                      questPoints: parseInt(questData[4]),
                      userEligible: true,
                      status: true,
                      series: questData[5]
                      
                  };
                  questEntries.push(quest);
                }
              }
          }
          index++;
      }
    
    this.data = questEntries;
  }

  public markEligible(username: string): void{
    var fullPath = this.osrsQuestURL+this.osrsUserStatPath+'/'+username;
    
    this.http.get(fullPath).subscribe( 
      {next: data =>
        {     
              //var responseData = <questResponse>data;
              console.log("RESPONSE RECEIVED");
              console.log(data);
        },
      error: error => { console.log(error)}
      }

      );
  }
}


/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}


