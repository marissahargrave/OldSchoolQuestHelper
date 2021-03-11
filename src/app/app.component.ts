import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Quests } from './mockData/questsList';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'RSQuestHelper';
  username= "";

  eligibleQuests = Quests;
  onGetUserStats(usernameInput: string){
    this.username = usernameInput;
  }
}
