import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  username= "";

  onGetUserStats(usernameInput: string){
    this.username = usernameInput;
    //console.log(usernameInput);
  }
}
