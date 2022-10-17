export const extractHours = (times) => {

    const timeStats = []
    const hours = [
        0, 1, 2, 3,
         4, 5, 6, 7,
         8, 9, 10,
         11, 12, 13, 14,
         15, 16, 17, 18,
         19, 20, 21, 22,
         23
        ]

    for(let i=0;i<hours.length;i++) {

        for(let j=0;j<times.length;j++) {

            const hour = times[j]._id.split('T')[1]

            if(Number.parseInt(hour) === hours[i]) {
                timeStats.push({ hour: Number.parseInt(hour), count: times[j].count })
                break
            }

        }


    }

    return timeStats
}