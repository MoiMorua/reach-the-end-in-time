import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StepCounterService } from '../../services/step-counter.service';
import { Cell, PathStep } from '../../common/interface';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {

  form:FormGroup
  cells:Cell[][]
  path:PathStep = null
  checked:boolean=false
  reacheable:boolean
  submited:boolean=true  

  constructor(
    private stepCounter:StepCounterService,
    private formBuilder:FormBuilder
  ) { 
    this.stepCounter = new StepCounterService()
    this.form = this.formBuilder.group({
      columns:['',[Validators.required,Validators.pattern('^[0-9]+$'),Validators.min(2),Validators.max(10)]],
      rows:['',[Validators.required,Validators.pattern('^[0-9]+$'),Validators.min(2),Validators.max(10)]],
      maxsteps:['',[Validators.required,Validators.pattern('^[0-9]+$'),Validators.min(2)]]
    })
  }

  generateColumns(){  
    
    if(!this.form.valid) {
      // console.log(this.form.hasError(''))
      
      Object.keys(this.form.controls).forEach((key)=>{
        this.form.get(key).valid
      })

      return    
    }
    
    this.stepCounter.columns = this.form.get('columns').value
    this.stepCounter.rows = this.form.get('rows').value
    this.stepCounter.maxSteps = this.form.get('maxsteps').value

    this.cells = this.stepCounter.getCells()
  }

  toggleCell([x,y]:number[]){    
    this.cells = this.stepCounter.toggleCell([x,y])
    this.path = null
    this.checked = false
  }

  check(){
    
    let response = this.stepCounter.canIReachTheEnd()    
    if(response.path) this.path =  response['path']['step']
    else this.path = null
    this.reacheable = response['reachable']
    this.checked = true

  }
  
  

}
