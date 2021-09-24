import { Injectable } from '@angular/core';
import { PathStep, Cell } from '../common/interface';

@Injectable({
  providedIn: 'root'
})
export class StepCounterService {

  

  grid:Cell[][] = []
  pathWall = ['#', '.']
  columns = 0
  rows = 0
  currentPos = [0, 0]
  currentStep:PathStep = { pos: [0, 0] }
  maxSteps = 0
  stepCount = 0
  stackSteps:PathStep[] = [this.currentStep]


  constructor() {}  

  getCells():Cell[][] {
      if (this.columns == 0 || this.rows == 0 || this.maxSteps == 0) return []

      this.grid = []
      for (let cellX = 0; cellX < this.rows; cellX++) {
          let row = []
          for (let cellY = 0; cellY < this.columns; cellY++) {
              row.push({
                  role: this.pathWall[Math.round(Math.random() * 1)]                  
              })
          }
          this.grid.push(row)
      }

      this.grid[0][0]['role'] = '.'      
      this.grid[this.rows - 1][this.columns - 1]['role'] = '.'
    //   
      return this.grid
  }

  toggleCell([x, y]:number[]):Cell[][] {
      if(x==0 && y == 0) return this.grid
      if (x == this.rows - 1 && y == this.columns - 1) return this.grid
      const cell = this.grid[x][y].role
      this.grid[x][y].role = cell === "#" ? '.' : '#'
      return this.grid
  }

  canIReachTheEnd() {
    this.currentStep= {pos:[0,0]}
    this.currentPos=[0,0]
    this.stackSteps= [this.currentStep]
    this.checkNeighborCells()
    
    let {count,path} = this.getMinCount()
    
    return {reachable:count <= this.maxSteps,path}

  }

  stepTo([x, y]:number[], prev) {      
      this.currentPos = [x, y]
      this.currentStep = { prev: prev, pos: this.currentPos }
      this.stackSteps.push(this.currentStep)
      if (!this.isInTheLastCell()) {
          this.checkNeighborCells()
          return
      }
      
      this.currentStep['success'] = true
  }

  checkNeighborCells() {

      const [x, y] = this.currentPos
      const prev:PathStep = this.currentStep
          //LEFT, RIGHT, UP and DOWN in that order
      const neighbors = [
          [x, y - 1],
          [x, y + 1],
          [x - 1, y],
          [x + 1, y]
      ]

      neighbors.forEach(neighbor => {
          this.isThisCellValid(neighbor, prev) && this.stepTo(neighbor, prev)
      })

  }

  haveIBeenHere([x, y], stepObject:PathStep) {

      const { pos } = stepObject
      const { prev } = stepObject
      if (pos[0] === x && pos[1] === y) {
          return true
      }
    //   
      if (prev && 'pos' in prev) return this.haveIBeenHere([x, y], prev)

      return false
  }
    
  isThisCellValid([x, y]:number[], stepObject:PathStep) {
    
    if ((x < 0 || y < 0 || x >= this.rows || y >= this.columns ) || this.grid[x][y].role == '#' || this.haveIBeenHere([x, y], stepObject))
        return false;

    return true
  }

  isInTheLastCell() {
      if ((this.currentPos[0] == this.rows - 1) && (this.currentPos[1] == this.columns - 1)) return true
      return false
  }

  countSteps(stepObject) {
      if (stepObject && stepObject.prev && 'pos' in stepObject.prev) {
          this.stepCount++
              this.countSteps(stepObject.prev)
      }

  }

  getMinCount() {
    let validPaths = []

    this.stackSteps.forEach(step => {
        'success' in step && step['success'] && validPaths.push({ step })
    })

    let possiblePathCount = []
    validPaths.forEach(({ step }) => {

        this.countSteps(step)
        possiblePathCount.push(this.stepCount)
        this.stepCount = 0

    })

    let count = Math.min(...possiblePathCount)
    return { path: validPaths[possiblePathCount.findIndex(el => el===count)], count }

  }



}
