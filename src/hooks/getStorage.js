export const getFindStorage = name => JSON.parse(localStorage.getItem(name));

export const getSetStorage = (name, value) => localStorage.setItem(name, JSON.stringify(value));

export const getRemoveStorage = (name, id) => {
    const memos = JSON.parse(getFindStorage(name));
    getSetStorage(name, JSON.stringify(memos.filter(value => value.id !== id)));
};

export const getConcatStorage = (name, value) => {
    const jsonItem = getFindStorage(name);
    if (!jsonItem) {
        getSetStorage(name, JSON.stringify(value));
    } else {
        const item = JSON.parse(jsonItem);
        const concatValue = value.concat(item);
        getSetStorage(name, JSON.stringify(concatValue));
    };
};