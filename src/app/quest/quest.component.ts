import { Component,  Input } from '@angular/core';
import { Quest } from '../quest/quest';

@Component({
  selector: 'app-quest',
  templateUrl: './quest.component.html',
  styleUrls: ['./quest.component.scss']
})
export class QuestComponent{

  @Input() quest!: Quest;
  

}
