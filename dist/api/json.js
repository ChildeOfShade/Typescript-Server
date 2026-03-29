export function respondWithJSON(res, code, obj) {
    res.status(code).json(obj);
}
export function respondWithError(res, code, msg) {
    res.status(code).json({ error: msg });
}
