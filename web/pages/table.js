import React from 'react'
import { parseTime } from '../src/resolvers'
import { Stack, Typography } from '@mui/material'

export default function table() {
    return (
        <main>
            <Stack direction={1} sx={{ border: '1px solid white' }}>
                <Columns index={0} />
                <Columns index={1} />
                <Columns index={2} />
                <Columns index={3} />
                <Columns index={4} />
                <Columns index={5} />
                <Columns index={6} />
                <Columns index={7} />
            </Stack>

        </main>

    )
}

const Course = ({ course, }) => {

    const { code, section, name, instructor, times } = course

    const start = Math.floor(parseTime(course.time[0]) / 100) - 8
    const end = Math.floor(parseTime(course.time[1]) / 100) - 8
    const day = ['M', 'T', 'W', 'Th', 'F', 'S', 'Su'].indexOf(course.time[2])

    return (
        <div>
            <Stack>
                <Typography variant='body1' textAlign='center'>
                    <strong>{code} - {section}</strong>
                </Typography>
                <Typography variant='body1' textAlign='center'>
                    {name}
                </Typography>
                <Typography variant='body1' textAlign='center'>
                    {instructor}
                </Typography>
                {
                    times?.map((time, idx) => (
                        <Typography key={idx} textAlign='center' variant='body2'>
                            {time[0]}-{time[1]} {time[2]}
                        </Typography>
                    ))
                }
            </Stack>
        </div>
    )
}

const Columns = ({ index }) => {
    const cell = { minWidth: '100px', minHeight: '30px', borderBottom: '1px solid white' }
    return (
        <Stack
            sx={{
                border: '1px solid white',
                minWidth: '100px',
            }}
        >
            <div style={cell}>
                <span>
                    {days[index]}
                </span>
            </div>
            {
                times.map((item, ikey) => (
                    <div key={ikey} style={cell}>
                        {
                            !index ? (
                                <span>{item}</span>
                            ) : (
                                <span></span>
                            )
                        }
                    </div>
                ))
            }
        </Stack>
    )
}


const classes = {
    table: {
        display: 'flex',
        flexDirection: 'row',
        width: '800px',
        height: '400px',
        border: '1px solid white',
    },
    columns: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        border: '1px solid black',
    },
};

const times = [
    '8:00 AM',
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
    '5:00 PM',
    '6:00 PM',
    '7:00 PM',
    '8:00 PM',
    '9:00 PM',
    '10:00 PM',
]

const days = {
    0: '',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
    7: 'Sunday',
}