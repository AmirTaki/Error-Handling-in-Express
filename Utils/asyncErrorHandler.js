const asyncErrorHanlder = (func) => {
    return(req, res, next) => {
       Promise.resolve(func(req, res, next).catch((err) => next(err)))
    }
}

module.exports = {asyncErrorHanlder}

/*
---------------------------- PROMISE ----------------------------------------------------------
const main = (bool) => {
    new Promise ((resolve, reject) => {
        (async() => {
            try {
                const results = await new Promise ((resolve, reject) => {
                    setTimeout(() => {
                        bool ? resolve('connect the server') : reject(new Error('warning 500 ....'))
                    }, 2000);
                }) 
                console.log(results)
                resolve()
            }
            catch(innerError){reject(innerError)}
        })()
    }) 
    .catch((err) => {console.log(err.message)})
}

main(false)

---------------------  CLEAN CODE PROMISE ------------------------------------------------------------
const promiseServer = (bool) => {
    return new Promise ((resolve, reject)  => {
        setTimeout(() => {
            bool ? resolve ('connect the server') : reject(new Error('warning code: 500 ...'))
        }, 2000)
    })
}

const asyncServer = async(bool) => {
    const results = await promiseServer(bool)
    console.log(results) 
}

const main = (func) => {return(bool) => { func(bool).catch((err) => {console.log(err.message)})}}

const server =  main(asyncServer)
server(false)



*/