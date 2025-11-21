// fonction à réutiliser dans plusieurs autres fonctions
// is valid permet de verifier la valeur de l'id pour voir s'il est valide

function isValidID(value){
    return Number.isInteger(Number(value)) && Number (value) > 0;
}


// on l'exporte pour le réutiliser partout
export {isValidID};