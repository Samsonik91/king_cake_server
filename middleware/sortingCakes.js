const {Cake, Price} = require("../models/model")

const sorting = async (prices, sortBy, limit, offset) => {
    const cakes = []
    const distinctPrices = []
    for(let i=0; i<prices.length; i++){
        let flag = true
        for(let k=0; k<distinctPrices.length; k++){
            const price = distinctPrices[k]
            if(price.cakeId === prices[i].cakeId){
                if(prices[i].value < price.value){
                    price.value = prices[i].value
                }
                flag = false
            }
        }
        if(flag){
            distinctPrices.push(prices[i])
        }else{
            flag = true
        }
    }

    if(sortBy === 'fromExpansiveToChip'){
        distinctPrices.reverse()
    }

    const count = distinctPrices.length
    const max = count > limit + offset ? offset + limit : count
    for(let i=offset; i<max; i++){
        const price = distinctPrices[i]
        const cake = await Cake.findOne({where: {id: price.cakeId}, include: [{model: Price, as: 'price'}]})
        cakes.push(cake)
    }

    return {count, cakes}
}

module.exports = sorting