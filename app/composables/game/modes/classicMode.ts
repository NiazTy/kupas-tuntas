export function classicMode(){

let score = 0

function correct(){
score += 10
}

function wrong(){
score += 0
}

return {
correct,
wrong
}

}