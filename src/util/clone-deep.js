function deepClone9(obj) {
    var i, len, ret;

    if (typeof obj !== "object" || obj === null) {
        return obj;
    }

    if (Array.isArray(obj)) {
        ret = [];
        len = obj.length;
        for (i = 0; i < len; i++) {
            ret.push( (typeof obj[i] === "object" && obj[i] !== null) ? deepClone9(obj[i]) : obj[i] );
        }
    } else {
        ret = {};
        for (i in obj) {
            if (obj.hasOwnProperty(i)) {
                ret[i] = (typeof obj[i] === "object" && obj[i] !== null) ? deepClone9(obj[i]) : obj[i];
            }
        }
    }
    return ret;
}

export default deepClone9;