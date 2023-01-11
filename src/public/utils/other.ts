export const pathPrettyPrinter = (path:string):string => {
    try{
        var finalString:string = '';
        var splitResult = path.split('/');
        splitResult.forEach((sRs, index)=>{
            finalString = finalString + `${sRs.charAt(0).toUpperCase() + sRs.slice(1)}`;
            if(index < (splitResult.length - 1)){
                finalString = finalString + ' / '
            }
        })
        return finalString;
    }catch(e){
        console.error(`${e}`)
        return path;
    }
}
export const removeUndefinedPropsFromObject = (fromRemove:object):object => {
    return JSON.parse(JSON.stringify(fromRemove));
}


export const parseMexicoNumberString = (number:string):string => {
    
    if(number.length !== 10){
        return number;
    }else{
        return `${number.charAt(0)}${number.charAt(1)} ${number.charAt(2)}${number.charAt(3)}${number.charAt(4)}${number.charAt(5)} ${number.charAt(6)}${number.charAt(7)}${number.charAt(8)}${number.charAt(9)}`
    }
}

export const excludedCharsOnNumberString = [",", " ", ".", "-", "_", "*"];

export const cleanString = (cadena:string):string => {
    
    var finalCadena:string = cadena;

    excludedCharsOnNumberString.forEach((character)=>{
        while(finalCadena.includes(character)){
            finalCadena = finalCadena.replace(character, "");
        }
    })

    return finalCadena;
}

export const validateEmail = (email:string):boolean => {
    if(email.split('@').length == 2 && email.indexOf('.') > 0){
        // The split ensures there's only 1 @
        // The indexOf ensures there's at least 1 dot.
        return true;
    }
    return false;
}