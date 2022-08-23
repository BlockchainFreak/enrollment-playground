let data = require("../data/coursesApi.json")

const dayMap = {M:0, T:1, W:2, R:3, F:4, S:5, U:6}

const parseTime = (str) => {
    let digits = str.split('').filter(c => (c>=0 && c<=9)).join('')
    digits = Number(digits)
    if(str.indexOf('P') !== -1 && digits < 1200 ){
        digits += 1200
    }
    return digits
}

const createClasses = (times, classes) => {
    const startTime = parseTime(times[0])
    const endTime = parseTime(times[1])
        
    times[2].split('').map(c => {
        const idx = dayMap[c]
        if(idx === undefined || idx === null) return ' ';
        classes[idx].push([startTime, endTime])
    })
}

const createClassesForAllTimes = (course, week) => {
    course.times.map(time => {
       createClasses(time, week) 
    })
}


const createWeek = (dataset) => {
    const week = [[], [], [], [], [], [], []]
    dataset.forEach(course => {
        createClassesForAllTimes(course, week)
    })
    return week;
}
let count = 1
const sortWeek = (week) => {
    week?.map((day) => 
        day.sort((a, b) => a[0] - b[0])
    )
}

const isWeekClashing = (week) => {
    sortWeek(week)
    for(let d = 0; d<week.length ; ++d){
        const day = week[d]
        for(let i = 1; i<day.length ; ++i){
            if(day[i-1][1] >= day[i][0])
                return true;
        }
    }
    return false;
}

const accum = (bi, buckets, currentCourseStack, clashFreeWeeks) => {
    if(bi >= buckets.length || buckets[bi].length === 0){
        const currentWeek = createWeek(currentCourseStack)
        const clashes = isWeekClashing(currentWeek)
        if(clashes === false){
            clashFreeWeeks.push([...currentCourseStack.map(c => c.code + '|' + c.section)])
        } 
        return;
    }

    for(const course of buckets[bi]){
        currentCourseStack.push(course)
        accum(bi + 1, buckets, currentCourseStack, clashFreeWeeks)
        currentCourseStack.pop()
    }
}

const getClashFreeWeeks = (buckets) => {
    let clashFreeWeeks = []
    let currentCourseStack = []
    accum(0, buckets, currentCourseStack, clashFreeWeeks)
    return clashFreeWeeks
}

export default getClashFreeWeeks