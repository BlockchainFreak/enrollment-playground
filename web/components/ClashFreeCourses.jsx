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
    const [clashFreeWeeks, setClashFreeWeeks] = useState(null)
    const [listView, setListView] = useState(false)

    useEffect(() => {
        const freeWeeks = getClashFreeWeeks(data)
        setClashFreeWeeks(freeWeeks)
    }, [data])

    if(clashFreeWeeks === null || !clashFreeWeeks.length) {
        return (
            <Box sx={{marginTop: '5vh', marginLeft: '4vw', width: '70vw'}}>
                <Typography variant='h4' color='error'>
                    All Possible Combinations of Courses are Clashing.
                    <br/>
                    No Clash Free Schedule Found!
                </Typography>
                <hr/>
                <Typography variant='h5' color='primary'>
                    Tip: Try Adding more Courses.
                </Typography>
            </Box>
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
