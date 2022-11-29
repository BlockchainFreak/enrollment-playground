import { useEffect, useState } from 'react'
import { dayMap, parseTime } from '../src/resolvers'
import { Button, Typography } from '@mui/material'
import { height } from '@mui/system'

export default function WeekTable({ courses, storage }) {

    const [tableMap, setTableMap] = useState([])
    const [currentCourse, setCurrentCourse] = useState(null)

    const timeHeight = 40;
    const timeWidth = 45;
    const dayWidth = 150;
    const dayHeight = 30;

    useEffect(() => {

        const getScaledTime = time => {
            const hours = Math.floor(parseTime(time) / 100)
            const mins = (parseTime(time) % 100)
            return hours + (mins / 60)
        }

        const tableMap = []
        courses?.map(courseKey => {
            const course = storage[courseKey]
            // 8:00 AM will Map to 0, 9:00 AM -> 1 and so on.
            course.times.map((time, timeI) => {
                const start = Math.floor(parseTime(time[0]) / 100) - 7
                const duration = getScaledTime(time[1]) - getScaledTime(time[0]) // 1hr class -> 1 unit
                const days = time[2].split('')
                days?.map(day => {
                    const dayIndex = dayMap[day]
                    tableMap.push({
                        course: course,
                        time: time[0] + ' - ' + time[1],
                        cords: {
                            x: 5 + timeWidth + ((6 + dayWidth) * dayIndex),
                            y: timeHeight + ((5 + timeHeight) * start),
                            width: dayWidth,
                            height: timeHeight * duration * 0.9,
                        }
                    })
                })
            })
        })
        setTableMap(tableMap)
    }, [courses, storage])

    if (!tableMap) return null

    return (
        <div style={{
            overflowY: 'auto',
            overflowX: 'auto',
            maxHeight: 'calc(80vh - 100px)',
            border: '1px solid #ddd',
            padding: '10px',
            marginRight: '30px',
        }}>
            <table cellSpacing="0" cellPadding="2">
                <colgroup width="4.5%" valign="middle" align="center" span="1" />
                <colgroup width="12.5%" valign="middle" align="center" span="7" />
                <tbody style={{ position: 'relative' }}>
                    <tr>
                        <td />
                        {
                            ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                <HeadCell
                                    label={day}
                                    width={dayWidth}
                                    height={dayHeight}
                                />
                            ))
                        }
                    </tr>
                    {
                        Array.from({ length: 14 }).map((row, rowI) => (
                            <tr key={rowI}>
                                <HeadCell
                                    label={rowI + 8 + ':00'}
                                    width={timeWidth}
                                    height={timeHeight}
                                />
                            </tr>
                        ))
                    }
                    {
                        tableMap?.map((cell, index) => {
                            if (cell) {
                                return <CourseCell
                                    key={index}
                                    course={cell.course}
                                    time={cell.time}
                                    cords={cell.cords}
                                />
                            }
                            return null
                        })
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

const CourseCell = ({ course, time, cords }) => {

    return (
        <div style={{
            position: 'absolute',
            top: cords.y,
            left: cords.x,
        }}>
            <Button variant='contained'
                color='success'
                sx={{ maxHeight: cords.height, minHeight: cords.height, minWidth: cords.width, fontSize: '0.8rem' }}
            >
                <Typography fontSize={12}>
                {course.code + ' ' + course.section}
                <br />
                {time}
                </Typography>
            </Button>
        </div>
    )
}

const HeadCell = ({ label, width, height }) => (
    <td style={SXheadcell}>
        {/* justify label text at the bottom of the div */}
        <div style={{ 
            minWidth: width, 
            minHeight: height,  
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
        }}>
            {label}
        </div>
    </td>
)

const SXheadcell = {
    border: '0.5px #aaa solid',
    textAlign: 'center',
    // minHeight: '100px',
}
