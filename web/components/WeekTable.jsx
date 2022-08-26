import { useEffect, useState } from 'react'
import { dayMap, parseTime } from '../src/resolvers'
import { Button } from '@mui/material'

export default function WeekTable({ courses, storage }) {

    const [tableMap, setTableMap] = useState(null)
    const [currentCourse, setCurrentCourse] = useState(null)
    
    useEffect(() => {
        const tableMap = getTableMap()
        courses.map(courseKey => {
            const course = storage[courseKey]
            // 8:00 AM will Map to 0, 9:00 AM -> 1 and so on.
            course.times.map((time, timeI) => {
                const start = Math.floor(parseTime(time[0]) / 100) - 8
                const end = Math.floor(parseTime(time[1]) / 100) - 8
                const days = time[2].split('')
                days.map(day => {
                    const dayIndex = dayMap[day]
                    //set the row-span = end - start + 1
                    tableMap[start][dayIndex] = {
                        rowspan: end - start + 1, course: course, time: timeI
                    }
                    // setting 0 as nullifier for not rendering extra cells
                    for(let i = start + 1; i <= end; ++i){
                        tableMap[i][dayIndex] = 0
                    }
                })
            })
        })
        setTableMap(tableMap)
    }, [courses])

    if(!tableMap) return null

    console.log(tableMap)
    return (
        <div style={{
            overflowY: 'auto', 
            maxHeight: 'calc(80vh - 100px)', 
            border: '1px solid #ddd',
            padding: '10px',
            marginRight: '30px',
        }}>
            <table cellSpacing="0" cellPadding="2">
                <colgroup width="4.5%" valign="middle" align="center" span="1"/>
                <colgroup width="12.5%" valign="middle" align="center" span="7"/>
                <tbody>
                    <tr>
                        <td/>
                        <td style={SXheadcell}>Monday</td>
                        <td style={SXheadcell}>Tuesday</td>
                        <td style={SXheadcell}>Wednesday</td>
                        <td style={SXheadcell}>Thursday</td>
                        <td style={SXheadcell}>Friday</td>
                        <td style={SXheadcell}>Saturday</td>
                        <td style={SXheadcell}>Sunday</td>
                    </tr>
                    {
                        tableMap.map((row, rowI) => (
                            <tr>
                                <td style={SXheadcell}>{`${rowI + 8}:00`}</td>
                                {
                                    row.map((cell, colI) => {
                                        if(cell){
                                            if(cell === 1) return <td/>
                                            return <td rowSpan={cell.rowspan}>
                                                <CourseCell 
                                                    course={cell.course} 
                                                    time={cell.time}
                                                />
                                            </td>
                                        }
                                        return null
                                    })
                                }
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

const getTableMap = () => (
    Array.from({ length: 14 }, () => (
        Array.from({ length: 7 }, () => 1)
    ))
)

const CourseCell = ({course, time}) => {
    
    return (
        <Button variant='contained' 
            color='success' 
            sx={{height: 'max'}}
        >
            {course.code + ' ' + course.section}
            {/* <br/>
            {course.name}
            <br/>
            {course.instructor} */}
            <br/>
            {course.times[time][0]} - {course.times[time][1]}
        </Button>
    )
}

const SXheadcell = {
    border: '0.5px #aaa solid',
    textAlign: 'center'
}
