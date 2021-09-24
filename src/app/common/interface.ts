
export interface Cell{
    role:string
}

export interface PathStep{
    pos:number[]
    prev?:PathStep
    successful?:boolean
}