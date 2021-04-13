import { AfterViewInit, Component, OnInit, ViewChild, Input, SimpleChange } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { QuestTableDataSource, QuestTableItem } from './quest-table-datasource';
import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

@Component({
  selector: 'app-quest-table',
  templateUrl: './quest-table.component.html',
  styleUrls: ['./quest-table.component.scss']
})

export class QuestTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<QuestTableItem>;
  dataSource!: QuestTableDataSource;

  @Input() username!: string;

  constructor(private http:HttpClient){

  }
  
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['title', 'status', 'difficulty', 'members', 'length', 'questPoints','series'];

  ngOnInit() {
    this.dataSource = new QuestTableDataSource(this.http);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  onQuestClick(item:QuestTableItem) {
    console.log(item);
  }

  ngOnChanges(changes: SimpleChange){
    this.dataSource.markEligible(this.username);
  }
}
