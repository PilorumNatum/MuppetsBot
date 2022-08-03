

export interface MyEventType {
    name: string,
    once?:boolean,
    execute: ((...args:any[])=>void) | ((...args:any[])=>Promise<void>)
}