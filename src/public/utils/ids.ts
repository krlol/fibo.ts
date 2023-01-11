export const makeId = (tokenLen:number, possible2?: string) => {
    if (tokenLen == null) {
        tokenLen = 16;
    }
    var text = "";
    const possible = possible2 || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < tokenLen; ++i)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}