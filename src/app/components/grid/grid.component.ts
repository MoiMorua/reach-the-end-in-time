import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Cell, PathStep } from '../../common/interface';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent{

  @Input()
  cells:Cell[][]  
  @Input()
  path:PathStep
  @Input()
  reacheable:boolean

  @Output()
  toggle: EventEmitter<number[]>

  constructor() {
    this.toggle = new EventEmitter()
  }  

  
  toggleCell([x,y]:number[]){
    this.toggle.emit([x,y])        
  }
  
  isInFinalPath([x,y]):boolean{

    if(!this.path) return false    
  
    if(this.find([x,y],this.path)){
      return true
    }
    return false
  }

  find([x,y],path:PathStep):boolean{    

    if(path.pos[0]==x && path.pos[1]==y){
      return true
    }
    
    if('prev' in path) return this.find([x,y],path.prev)
  
    return false
  }


}
  