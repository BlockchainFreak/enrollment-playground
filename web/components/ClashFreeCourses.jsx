import {useEffect, useState} from 'react'
import {Table, TableBody, TableCell, TableContainer, TableHead, Box, LinearProgress,
TableRow, Paper, IconButton, Button, Typography, Pagination } from '@mui/material'
import getClashFreeWeeks from '../src/resolvers'
import CloseIcon from '@mui/icons-material/Close'
import TableViewIcon from '@mui/icons-material/TableView'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import WeekTable from './WeekTable'

export default function ClashFreeCourses({setIsFiltering, storage, data}) {
  
    const [currentWeek, setCurrentWeek] = useState(1)
    const [clashFreeWeeks, setClashFreeWeeks] = useState([])
    const [listView, setListView] = useState(false)
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
        // }, Math.min(freeWeeksLength, 60))
        }, Math.min(freeWeeksLength, 10))
    }, [data])

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
            {listView ? (<Paper>
                <TableContainer component={Paper} sx={{maxHeight: "calc(90vh - 150px)"}}>
                    <Table sx={{ minWidth: 650 }} size="medium" stickyHeader>
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
                                <TableCell component="th" scope="row">{index + 1}</TableCell>
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
            </Paper>) : (
                <WeekTable courses={clashFreeWeeks[currentWeek - 1]} storage={storage}/>
            )}
            <Pagination
                sx={{position: 'absolute', right: '30px', bottom: '20px'}}
                color="standard"
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
            <Button
                variant='contained'
                color='success'
                onClick={() => setListView(s => !s)}
                sx={{position: 'absolute', bottom: '20px', left: '20px', minWidth: '160px'}}
            >
                {listView ? (
                    <>Table View <TableViewIcon sx={{marginLeft: '5px'}}/></>
                ) : (
                    <>List View <FormatListNumberedIcon sx={{marginLeft: '5px'}}/></>
                )}
            </Button>
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
