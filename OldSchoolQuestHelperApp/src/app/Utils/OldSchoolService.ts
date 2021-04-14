import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { QuestTableItem } from '../components/quest-table/quest-table-datasource'

export interface IQuestResponse{
    raw: string;
}

export interface IUserStatBlock{
    overall: number,
    attack: number,
    defence: number,
    strength: number,
    hitpoints: number,
    ranged: number,
    prayer: number,
    magic: number,
    cooking: number,
    woodcutting: number,
    fletching: number,
    fishing: number,
    firemaking: number,
    crafting: number,
    smithing: number,
    mining: number,
    herblore: number,
    agility: number,
    thieving: number,
    slayer: number,
    farming: number,
    runecrafting: number,
    hunter: number,
    construction: number
}

export class OldSchoolService {
    private osrsQuestURL: string = "http://localhost:8124";
    private osrsQuestListPath: string = "/questList";
    private osrsUserStatPath: string = "/user";

    constructor(private http:HttpClient){}

    public getQuestList(): Observable<QuestTableItem[]> {
        return this.http.get(this.osrsQuestURL+this.osrsQuestListPath)
                .pipe(
                    map(res =>  OldSchoolService.convertDom((<IQuestResponse>res).raw)))
    }

    public getUserStats(username: string): Observable<IUserStatBlock>{
        return this.http.get(this.osrsQuestURL+this.osrsUserStatPath+username)
            .pipe(
                map(res =>  <IUserStatBlock>res))
    }

    public static convertDom(questDom: string): QuestTableItem[]{
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
        
        return questEntries;
      }

}