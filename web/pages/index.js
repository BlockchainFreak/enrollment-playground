import styles from '../styles/Home.module.css'
import { Button, Snackbar, Alert } from '@mui/material'
import MemoryIcon from '@mui/icons-material/Memory';
import NotesIcon from '@mui/icons-material/Notes';
import BackspaceIcon from '@mui/icons-material/Backspace';
import Bucket from '../components/Bucket'
import CourseSearchBar from '../components/CourseSearchBar'
import ClashFreeCourses from '../components/ClashFreeCourses'
import Demo from '../components/Demo';
import useModal from '../hooks/useModal'
import { useState, useEffect, useRef } from 'react'

let getDefault = () => [[], [], [], [], [], [], []]

export default function Home() {
    const [data, setData] = useState(getDefault())
    const [storage, setStorage] = useState(undefined)

    const [alert, SetAlert] = useState({
        message: '', severity: 0
    })

    const [modal, setModal, AddModal] = useModal(null)
    const [isFiltering, setIsFiltering, ResolvingModal] = useModal(null)
    const [demo, setDemo, DemoModal] = useModal(null)

    const cachedSearchValue = useRef('')
    
    useEffect(() => {
        async function fetcher() {
            const response = await fetch('/api/data')
            const json = await response.json()
            setStorage(json)
        }
        fetcher()

        if(localStorage.getItem('buckets')){
            setData(JSON.parse(localStorage.getItem('buckets')))
        }
    }, [])

    const handleProcessRequest = () => {
        if(data[0].length === 0){
            SetAlert({message:'No courses added to bucket', severity: 2})
        }
        else if(data[0].length < 1 || data[1].length < 1){
            SetAlert({message:'Courses are Insufficient.', severity: 1})
        } else {
            setIsFiltering(1)
        }
    }

    const handleAlertClose = () => {
        SetAlert({message:'', severity: 0})
    }

    const clearAll = () => {
        setData(data => {
            const newdata = [...data]
            newdata.map((bucket) => {bucket.splice(0,bucket.length)})
            return newdata
        })
    }

    return(
        <main>
            <div>
                <h1>This is a legacy app. Version 2 is coming soon. Stay tuned. Link will be shared on LDF.</h1>
            </div>
            <Bucket {...{data, setData, setModal}} />
            <AddModal>
                <CourseSearchBar {...{modal, setModal, data, setData, storage, cachedSearchValue}}/>
            </AddModal>
            <ResolvingModal>
                <ClashFreeCourses {...{setIsFiltering, storage, data}}/>
            </ResolvingModal>
            <DemoModal>
                <Demo setDemo={setDemo}/>
            </DemoModal>
            <Button 
                onClick={handleProcessRequest}
                variant='contained'
                color='success'
                sx={{
                    position: "fixed",
                    right: '20px',
                    bottom: '20px',
                }}
            >
                <MemoryIcon/>
                Process
            </Button>
            <Button 
                onClick={() => setDemo(1)}
                variant='contained'
                color='secondary'
                sx={{
                    position: "fixed",
                    right: '160px',
                    bottom: '20px',
                }}
            >
                <NotesIcon/>
                Guide
            </Button>
            <Button
                onClick={() => {setData(getDefault())}}
                variant='contained'
                color='error'
                sx={{
                    position: "fixed",
                    right: '275px',
                    bottom: '20px',
                }}
            >
                Clear All
                <BackspaceIcon sx={{marginLeft: '10px'}}/>
            </Button>
            <Snackbar open={Boolean(alert.severity)} autoHideDuration={2500} onClose={handleAlertClose}>
                <Alert onClose={handleAlertClose}
                severity={alert.severity === 2 ? 'error' : 'warning'} 
                sx={{ width: '100%' }}>
                {alert.message}
                </Alert>
        </Snackbar>
        </main>
  )
}


const testData = JSON.parse(`[[{"code":"CS 200","name":"Introduction to Programming",
"section":"LEC 2","credit":"4","instructor":"Waqar Ahmad","times":[["1:00PM","2:15PM","MW"],["9:30AM","12:20P","F"]],"hasLab":true},
{"code":"CS 200","name":"Introduction to Programming","section":"LEC 1","credit":"4","instructor":"Mian Muhammad Awais","times":[["12:30PM","1:45PM","TR"],["1:00PM","3:50PM","W"]],"hasLab":true}],[{"code":"CS 210","name":"Discrete Mathematics","section":"LEC 1","credit":"4","instructor":"Imdad ullah khan","times":[["3:30PM","5:20PM","TR"]],"hasLab":false},{"code":"CS 210","name":"Discrete Mathematics","section":"LEC 2","credit":"4","instructor":"Basit Shafiq","times":[["11:00AM","12:50P","MW"]],"hasLab":false}],[{"code":"CS 225","name":"Fundamentals of Computer Systems","section":"LEC 2","credit":"4","instructor":"Basit Shafiq","times":[["9:00AM","10:50A","TR"]],"hasLab":false},{"code":"CS 225","name":"Fundamentals of Computer Systems","section":"LEC 1","credit":"4","instructor":"Agha Ali Raza","times":[["2:30PM","4:20PM","MW"]],"hasLab":false}],[{"code":"MATH 102","name":"Calculus II","section":"LEC 2","credit":"3","instructor":"Sultan Sial","times":[["2:00PM","3:15PM","TR"]],"hasLab":false},{"code":"MATH 102","name":"Calculus II","section":"LEC 1","credit":"3","instructor":"Masood Hussain Shah","times":[["12:30PM","1:45PM","TR"]],"hasLab":false}],[{"code":"SS 102","name":"Pakistan Studies: Culture and Heritage","section":"LEC 8","credit":"2","instructor":"TBA","times":[["4:00PM","5:50PM","R"]],"hasLab":false},{"code":"SS 102","name":"Pakistan Studies: Culture and Heritage","section":"LEC 5","credit":"2","instructor":"TBA","times":[["2:30PM","4:20PM","F"]],"hasLab":false},{"code":"SS 102","name":"Pakistan Studies: Culture and Heritage","section":"LEC 4","credit":"2","instructor":"TBA","times":[["9:00AM","10:50A","F"]],"hasLab":false},{"code":"SS 102","name":"Pakistan Studies: Culture and Heritage","section":"LEC 3","credit":"2","instructor":"TBA","times":[["4:00PM","5:50PM","F"]],"hasLab":false},{"code":"SS 102","name":"Pakistan Studies: Culture and Heritage","section":"LEC 2","credit":"2","instructor":"TBA","times":[["11:00AM","12:50P","F"]],"hasLab":false},{"code":"SS 102","name":"Pakistan Studies: Culture and Heritage","section":"LEC 6","credit":"2","instructor":"TBA","times":[["4:00PM","5:50PM","T"]],"hasLab":false},{"code":"SS 102","name":"Pakistan Studies: Culture and Heritage","section":"LEC 7","credit":"2","instructor":"TBA","times":[["3:00PM","4:50PM","F"]],"hasLab":false},{"code":"SS 102","name":"Pakistan Studies: Culture and Heritage","section":"LEC 1","credit":"2","instructor":"TBA","times":[["2:30PM","4:20PM","M"]],"hasLab":false}],[],[]]`)
