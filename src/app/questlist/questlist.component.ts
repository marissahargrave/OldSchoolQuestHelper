import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpParamsOptions } from '@angular/common/http';
import { Quest } from '../quest/quest';
import { Subscription } from 'rxjs';
import { RSWikiService } from '../Services/rsWikiService';
import { Injectable } from '@angular/core';
import { Quests } from '../mockData/questsList';

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
        var questEntriesHTML: HTMLCollection[] = [];
        var questEntries: Quest[] = [];
        //There's no class name we're getting back that makes these quest tables unique
        var index: number = 0;
        for(let table of tables){
            if(index === 1 || index === 3){
              for(let row of table.getElementsByTagName("tr")){
                  var quest:Quest;
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
      this.quests = questEntries;
    }
}

export interface questResponse{
  raw: string;
}
