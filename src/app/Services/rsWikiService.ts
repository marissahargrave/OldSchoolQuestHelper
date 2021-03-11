import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Quests } from '../mockData/questsList';
import { Quest } from '../quest/quest';

@Injectable({
    providedIn: 'root',
  })
export class RSWikiService{
    private rsURL: string = "https://runescape.wiki/cors/m=runemetrics/";
    private osrsQuestURL: string = "http://localhost:8124/questList";
    private questDom: any;
    constructor(private http: HttpClient) { }
    

    ngOnInit() {      
        // Simple GET request with response type <any>
        
    }

    getQuests(): Quest[]{
        const headers = new HttpHeaders({ 'responseType': 'text' });
        this.http.get<any>(this.osrsQuestURL, { headers } ).subscribe(data => {
            this.questDom = data;
        })
        return Quests;
    }
}