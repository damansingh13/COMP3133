export const add = (i, j) => i + j;

export const mul = (i, j) => i * j;

export const div = (i, j) => {
    if (j === 0) throw new Error('Division by zero');
    return i / j;
};

export const sub = (i, j) => i - j;
