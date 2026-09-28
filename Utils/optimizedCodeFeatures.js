class optimizedCodeFeatures {
    constructor(mongooseQuery, queryString){
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
        this.cleanedQuery = {...queryString}
    }

    // EXCLUDING QUERY OBJECT       
    exclude () {
        const excludedFields = ["sort", "fields", "page", "limit"];        
        this.cleanedQuery = Object.fromEntries(
            Object.entries(this.queryString).filter(([key]) => {return !excludedFields.includes(key)})
        )
        return this
    }

    // FORMAT MOGNO QUERY
    #formatMongoQuery (object){
        if(Array.isArray(object)){
            return object.map((item) => this.#formatMongoQuery(item))
        }

        if(typeof object === "object" && object !== null){    
            const mongoOperators = ['lt', 'lte', 'gt', 'gte', 'or', 'nor', 'and', 'in', 'nin'];
            return Object.fromEntries(
                Object.entries(object).map(([key, value]) => {
                    const newKay = mongoOperators.includes(key) ? `$${key}` : key
                    return [newKay, this.#formatMongoQuery(value)]
                })
            )
        }
        return object
    }
    //  ADVANCED FILTERING --> app.set('query parser', 'extended'); 
    filter() {
        this.exclude()
        const finalQuery =  this.#formatMongoQuery(this.cleanedQuery)
        this.mongooseQuery = this.mongooseQuery.find(finalQuery)
        return this
    }
    // SORT
    sort() {
        this.mongooseQuery = this.queryString.sort ? this.mongooseQuery.sort(this.queryString.sort.split(',').join(" ")) : this.mongooseQuery.sort('-createdAt')
        return this
    }

    // LIMITING FIELDS
    limitFields() {
        this.mongooseQuery =  this.queryString.fields ? this.mongooseQuery.select(this.queryString.fields.split(',').join(' ')) : this.mongooseQuery.select('-__v');
        return this
    }
    // PAGINATION --> PAGE & LIMIT
    pagination() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 10
        // PAGE 1: 1 - 10; PAGE 2: 11 - 20; PAGE 3: 21 - 30
        const skip = (page - 1) * limit
        this.mongooseQuery =  this.mongooseQuery.skip(skip).limit(limit);
        return  this
    }
}


module.exports = optimizedCodeFeatures;