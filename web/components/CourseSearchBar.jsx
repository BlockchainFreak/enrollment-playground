import { useEffect, useState, memo } from 'react'
import {Table, TableBody, TableCell, TableContainer, TableHead, 
TableRow, Paper, TextField, IconButton, Button  } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';

function CourseSearchBar({modal, setModal, data, setData, storage, cachedSearchValue}){
    const [code, setCode] = useState(cachedSearchValue.current ? cachedSearchValue.current : '')
    const [filteredCourses, setFilteredCourses] = useState([])
    const [error, setError] = useState(false)

    const handleChange = async(e) => {
        setCode(e.target.value)
        cachedSearchValue.current = e.target.value
    }

    const selectCourse = (e, index) => {
        e.preventDefault()
        const course = filteredCourses[index]
        setData(oldData => {
            const newData = [...oldData]
            newData[modal].push(course)
            return newData
        })
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

    useEffect(() => {
        if(code.length < 4) {
            setFilteredCourses([])
            if (error) setError(false)
            return;
        }
        const filtered = Object.values(storage).filter((item) => {
            return item.code.includes(code.toUpperCase())
        })
        if(filtered.length === 0){
            setError(true)
            setFilteredCourses([])
        }
        const sortedCourses = sortCoursesBySelection(filtered)
        setFilteredCourses([...sortedCourses])
    }, [code, error, storage])

    return(
        <>
            <TextField
            error = {error}
            label="course code"
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
                        {filteredCourses.map((row, index) => (
                            <TableRow hover
                            key={row.name + row.section}
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