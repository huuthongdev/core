export function ClassNames(obj: any) {
    let className = '';

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const item = obj[key];
            if (item) className += ` ${key}`;
        }
    }

    if (className) return className.substr(1);
    return className;
}