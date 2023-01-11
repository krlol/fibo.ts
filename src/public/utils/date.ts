export const tiempoExacto = ():string => {
    var nowDate = new Date();
    return `${nowDate.getFullYear()}${nowDate.getMonth()}${nowDate.getDate()}${nowDate.getHours()}${nowDate.getMinutes()}${nowDate.getMilliseconds()}`;
}