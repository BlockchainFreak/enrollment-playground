import React from 'react'
import { Stack, Typography, IconButton} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';

export default function course({
    code, section, name, instructor, times, handleRemoval
}) {

    return(
        <div className="dnd-item">
            <IconButton sx={{
                position: "absolute",
                right: "4px",
                top: "4px",
            }}
                onClick={handleRemoval}
            >
                <DeleteIcon size="large" sx={{color: "white"}}/>
            </IconButton>
            <Stack>
                <Typography sx={{fontSize: "1vw"}} textAlign='center'>
                    <strong>{code} - {section}</strong>
                </Typography>
                <Typography sx={{fontSize: "1vw"}} textAlign='center'>
                    {name}
                </Typography>
                <Typography sx={{fontSize: "1vw"}} textAlign='center'>
                    {instructor}
                </Typography>
                {
                    times?.map((time, idx) => (
                        <Typography key={idx} textAlign='center' sx={{fontSize: "0.9vw"}}>
                            {time[0]}-{time[1]} {time[2]}
                        </Typography>
                    ))
                }
            </Stack>
        </div>
    )
}
