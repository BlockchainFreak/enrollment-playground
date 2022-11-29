import { Typography, Button, Box } from "@mui/material";
import Link from 'next/link'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import YouTubeIcon from '@mui/icons-material/YouTube';

export default function Demo({setDemo}) {

    return (
        <>
            <Box sx={{position: 'absolute', top: "5vh", overflowX: 'auto', paddingRight: 5}}>
                <Typography variant="h5" textAlign='center' sx={{marginRight: "40px", fontSize: '2vmax'}}>
                    The App would generate a list of schedules based on the courses you add to your bucket.
                    It would pick one course from each bucket and generate a schedule. However, it will only
                    display you courses that are not in conflict with each other.
                </Typography>
                <Box textAlign='center' sx={{padding: '1vmax'}}>
                    <Link href='https://www.youtube.com/watch?v=XDYQEso04H0' passHref>
                        <a target="_blank" rel="noopener noreferrer">
                            <Button color='error'>
                                View Tutorial
                                <YouTubeIcon sx={{marginLeft: '5px'}}/>
                            </Button>
                        </a>
                    </Link>
                </Box>
                <Typography sx={{marginTop: "1vmax"}} variant="subtitle1">
                    Protocols to be followed
                </Typography>
                <Typography variant="body1" fontSize={12}>
                    <ul>
                        <li>A Bucket consist of parallel courses i.e. different sections of same course: CS100-S1, CS100-S2</li>
                        <li>It is recommended for a bucket to have 2 or more courses</li>
                        <li>Click on Process Icon to generate a list of all possible combinations
                            of courses you can take</li>
                        <li>{`It is guaranteed that the algorithm will always genertate a list of 
                            schedules free of clashes :)`}
                        </li>
                    </ul>
                </Typography>
            </Box>
            <Button
                variant='contained'
                color='success'
                sx={{
                    position: "absolute",
                    right: "20px",
                    bottom: "20px",
                }}
                onClick={() => setDemo(null)}
            >
                <ArrowForwardIcon size="large"/>
            </Button>
        </>
    )
}
