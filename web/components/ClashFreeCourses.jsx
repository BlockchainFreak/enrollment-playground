import {useEffect, useState, useRef} from 'react'
import {Table, TableBody, TableCell, TableContainer, TableHead, Box, LinearProgress,
TableRow, Paper, TextField, IconButton, Button, Typography, Pagination } from '@mui/material'
import getClashFreeWeeks from '../scripts/resolvers'
import CloseIcon from '@mui/icons-material/Close';


export default function ClashFreeCourses({setIsFiltering, storage, data}) {
  
    const [currentWeek, setCurrentWeek] = useState(1)
    const [clashFreeWeeks, setClashFreeWeeks] = useState([])

    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const freeWeeks = getClashFreeWeeks(data)
        setClashFreeWeeks(freeWeeks)
        const freeWeeksLength = freeWeeks.length

        const incrementInterval = setInterval(() => {
            if(progress >= 100){
                clearInterval(incrementInterval)
            }
            setProgress(p => p+1)
        }, Math.min(freeWeeksLength, 60))
    }, [])

    const getProgress = () => Math.min(progress, 100)

    if(progress < 120){
        return(
            <>
                <Box sx={{height: "30vh",}} />
                <LinearProgressWithLabel value={getProgress()}/>
                <Box textAlign='center'>
                    <Button variant='contained'color='success'>
                        Clash-Free Weeks Found: {Math.round(getProgress()/100 * clashFreeWeeks?.length)}
                    </Button>
                </Box>
            </>
        )
    }

    return(
        <>
            <Paper>
                <TableContainer component={Paper} sx={{maxHeight: "calc(90vh - 150px)"}}>
                    <Table sx={{ minWidth: 650 }} size="small" stickyHeader>
                        <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Code</TableCell>
                            <TableCell>Section</TableCell>
                            <TableCell>Course Name</TableCell>
                            <TableCell>Credits</TableCell>
                            <TableCell>Instructor</TableCell>
                            <TableCell>Start Time</TableCell>
                            <TableCell>End Time</TableCell>
                            <TableCell>Days</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {clashFreeWeeks[currentWeek - 1]?.map((courseKey, index) => {
                            const course = storage[courseKey]
                            return(
                                <TableRow hover
                                key={courseKey}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                <TableCell component="th" scope="row">{index}</TableCell>
                                <TableCell>{course.code}</TableCell>
                                <TableCell>{course.section}</TableCell>
                                <TableCell>{course.name}</TableCell>
                                <TableCell>{course.credit}</TableCell>
                                <TableCell>{course.instructor}</TableCell>
                                <TableCell>{course.times.map(t => t[0]).join(' Lab-')}</TableCell>
                                <TableCell>{course.times.map(t => t[1]).join(' Lab-')}</TableCell>
                                <TableCell>{course.times.map(t => t[2]).join(' Lab-')}</TableCell>
                                </TableRow>
                            )
                        })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <Pagination
                sx={{position: 'absolute', right: '30px', bottom: '30px'}}
                color="primary"
                count={clashFreeWeeks.length}
                page={currentWeek}
                onChange={(e, value) => setCurrentWeek(value)}
            />
            <IconButton
                sx={{
                    position: "absolute",
                    right: "20px",
                    top: "20px",
                }}
                onClick={() => setIsFiltering(null)}
            >
                <CloseIcon size="large"/>
            </IconButton>
        </>
    )
}

function LinearProgressWithLabel(props) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            props.value,
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }
