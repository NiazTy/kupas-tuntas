export function timeAttackMode(){

let score = 0
let time = 60

function correct(){
score += 15
}

function wrong(){
time -= 5
}

return {
correct,
wrong
}

}