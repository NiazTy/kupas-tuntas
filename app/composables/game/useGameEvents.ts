import mitt from "mitt"

const emitter = mitt()

export function useGameEvents() {
    function emit(event:string,data?:any){
        emitter.emit(event, data)
    }

    function on(event:string,handler:any){
        emitter.on(event, handler)
    }

    function off(event:string,handler:any){
        emitter.off(event, handler)
    }

    return { emit, on, off }
}