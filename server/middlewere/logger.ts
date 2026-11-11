import type { NextFunction } from "express";




export function logger(req, res, next: NextFunction) {
    const start = performance.now();
    
    if(req.body){
        console.log("with body");
        
    }

    res.on('finish', () => {
        const ms = Math.round(performance.now() - start);
        console.log(`${req.method} ${req.originalUrl}  ${res.statusCode} ${ms} ms`)

    })
    next();
}