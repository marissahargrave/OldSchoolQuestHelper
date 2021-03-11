import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpParamsOptions } from '@angular/common/http';
import { Quest } from '../quest/quest';
import { Subscription } from 'rxjs';
import { RSWikiService } from '../Services/rsWikiService';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-questlist',
  templateUrl: './questlist.component.html',
  styleUrls: ['./questlist.component.scss']
})


export class QuestlistComponent implements OnInit {
  //questDom!: string;
  quests: Quest[];
  questDom: string;
  private osrsQuestURL: string = "http://localhost:8124/questList";
  private request!: Subscription;
  private rsWikiService!: RSWikiService;

  constructor(private http: HttpClient) {
    this.quests = [];
    this.questDom = '';
  }
  

  ngOnInit(): void {
    //this.quests = this.rsWikiService.getQuests();
    const headers = new HttpHeaders({ 'responseType': 'text', 'content-type': 'text/html' });
    //const options = new HttpParamsO
    console.log("SENDNG REQUEST");
    //console.log(headers.get('responseType'));
    //this.request = this.http.get<any>(this.osrsQuestURL).subscribe( data =>
    this.http.get(this.osrsQuestURL).subscribe( 
    {next: data =>
    {     //data.json()
          var responseData = <questResponse>data;
          console.log("RESPONSE RECEIVED");
          console.log(data);
          this.convertDom(responseData.raw); 
          // var wrapper = document.createElement("div");
          // wrapper.id = "wrapper";
          // wrapper.innerHTML = data;
          // var tables: any = wrapper.getElementsByClassName("wikitable");
          // var questEntries;
          // this.questDom = data;
          // for(let table of tables){
          //     questEntries = table.getElementsbyTag("td");
          // }
    },
    error: error => { console.log(error)}
    }

    );
  }

  ngOnDestroy(){
    //this.request.unsubscribe();
  }

  @Input() username!: string;

  convertDom(questDom: string): void{
    console.log("CONVERT DOM");
      var wrapper = document.createElement("div");
      wrapper.id = "wrapper";
      wrapper.innerHTML = questDom;
      var tables: any = wrapper.getElementsByClassName("wikitable");
      var questEntries: HTMLCollection[] = [];
      for(let table of tables){
          for(let row of table.getElementsByTagName("tr")){
            for(let data of row.getElementsByTagName("td")){
              questEntries.push(data)
            }
            
          }
          //questEntries.push(table.getElementsByTagName("td"));
      }
      
  }

}

export interface questResponse{
  raw: string;
}
