class Apifeatures {
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    //  ADVANCED FILTERING --> app.set('query parser', 'extended'); 
    filter() {
        const excludeFilter = ["sort", "fields"," page", "limit"]
        const queryObj =  Object.fromEntries( Object.entries(this.queryStr).filter(([key, value]) => {return !excludeFilter.includes(key)}))
        const finalQuery = JSON.parse(JSON.stringify(queryObj).replace(/\b(gte|gt|lt|lte)\b/g, (match) => {return `$${match}`}))
        this.query = this.query.find(finalQuery)
        return this   
    }

    //  SORT 
    sort () {
        if(this.queryStr.sort){
            const sortBy = this.queryStr.sort.split(",").join(' ')
            this.query = this.query.sort(sortBy)
        }
        else {
            this.query = this.query.sort("-createdAt")
        }
        return this
    }

    // LIMITING FIELDS
    limitFields() {
        if(this.queryStr.fields){
            const fields = this.queryStr.fields.split(',').join(' ')
            this.query = this.query.select(fields)
        }   
        else {
            this.query = this.query.select('-__v')
        }
        return this
    }
    
    // PAGINATION --> PAGE & LIMIT
    pagination() {
        
        const page = this.queryStr.page * 1 || 1
        const limit = this.queryStr.limit * 1 || 10
        // PAGE 1: 1 - 10; PAGE 2: 11 - 20; PAGE 3: 21 - 30
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit);

        // if(this.queryStr.page){
        //     const movieCount =  await Movie.countDocuments()
        //     if(skip >= movieCount){
        //         throw new Error("This page is not found!")
        //     }
        // }
        
        return this
    }



}


module.exports = Apifeatures;