import { useEffect, useState, useRef, memo } from 'react'
import {Table, TableBody, TableCell, TableContainer, TableHead, 
TableRow, Paper, TextField, IconButton, Button  } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';

function CourseSearchBar({modal, setModal, data, setData, storage, cachedSearchValue}){
    const [code, setCode] = useState(cachedSearchValue.current ? cachedSearchValue.current : '')
    const filteredCourses = useRef()
    const [error, setError] = useState(false)

    const handleChange = async(e) => {
        setCode(e.target.value)
        cachedSearchValue.current = e.target.value
    }

    const selectCourse = (e, index) => {
        e.preventDefault()
        const course = filteredCourses.current[index]
        setData(oldData => {
            const newData = [...oldData]
            newData[modal].push(course)
            return newData
        })
        localStorage.setItem('buckets', JSON.stringify(data))
    }

    const isAlreadySelected = (course) => {
        const courseCode = course.code + course.section
        for(const bucket of data){
            for(const Bcourse of bucket){
                if(Bcourse.code + Bcourse.section === courseCode){
                    return true
                }
            }
        }
        return false
    }

    const sortCoursesBySelection = (courses) => {
        let sortedCourses = []
        courses.forEach((course) => {
            if(!isAlreadySelected(course))
                sortedCourses.push(course)
        })
        courses.forEach((course) => {
            if(isAlreadySelected(course))
                sortedCourses.push(course)
        })
        return sortedCourses
    }

    const getFilteredCourses = () => {
        if(code.length < 2) {
            return null;
        }
        const filtered = Object.values(storage).filter((item) => {
            return code.toLowerCase().split(" ").every(i => (item.code + item.name + item.instructor).toLowerCase().includes(i))
        })
        if(filtered.length === 0){
            return null;
        }
        const sortedCourses = sortCoursesBySelection(filtered)
        filteredCourses.current = sortedCourses
        console.log(sortedCourses)
        return sortedCourses
    }

    return(
        <>
            <TextField
            error = {error}
            label="Search Course"
            value={code}
            onChange={(e) => handleChange(e)}
            width="30vw"
            helperText={error && "Incorrect Code"}
            defaultValue="CS 100"
            />
            <hr/>
            <Paper>
                <TableContainer component={Paper} sx={{maxHeight: "calc(80vh - 150px)"}}>
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
                            <TableCell/>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {getFilteredCourses()?.map((row, index) => (
                            <TableRow hover
                            key={row.name + row.section + index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                            <TableCell component="th" scope="row">{index + 1}</TableCell>
                            <TableCell>{row.code}</TableCell>
                            <TableCell>{row.section}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.credit}</TableCell>
                            <TableCell>{row.instructor}</TableCell>
                            <TableCell>{row.times.map(t => t[0]).join(' Lab-')}</TableCell>
                            <TableCell>{row.times.map(t => t[1]).join(' Lab-')}</TableCell>
                            <TableCell>{row.times.map(t => t[2]).join(' Lab-')}</TableCell>
                            <TableCell><Button
                                variant="contained" 
                                color="success"
                                onClick={(e) => selectCourse(e, index)}
                                disabled={isAlreadySelected(row)}
                            >
                                SELECT
                            </Button></TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <IconButton
                sx={{
                    position: "absolute",
                    right: "20px",
                    top: "20px",
                }}
                onClick={() => setModal(null)}
            >
                <CloseIcon size="large"/>
            </IconButton>
        </>
    )
}

export default CourseSearchBar