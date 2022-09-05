import { useState, useEffect, useRef } from 'react'
import { Typography, Box, Stack, Button, } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import Course from './Course'

export default function Bucket({data: buckets, setData: setBuckets, setModal}) {

  const handleRemoval = (bucketI, itemI) => {
    setBuckets(oldBucket => {
      let newBucket = [...oldBucket]
      newBucket[bucketI].splice(itemI, 1)
      if(bucketI && newBucket[bucketI].length === 0){
        newBucket.splice(bucketI,1)
        newBucket.push([])
      }
      return newBucket
    })
  }

  return (
    <div className="drag-n-drop">
      {buckets.map((bucket, bucketI) => (
        <div
          key={bucketI} 
          className="dnd-group"
        >
          <Stack direction="row">
            <Typography variant="h5" textAlign='center' sx={{width: "100%"}}>
              <strong>CLASS {bucketI + 1}</strong>
            </Typography>
            <Button
              variant='contained'
              color='success'
              onClick={() => setModal(bucketI)}
              sx= {{
                marginBottom: "20px", 
                display: (bucketI && buckets[bucketI - 1].length === 0) ? "none" : ""
            }}>
            <AddIcon/>
            </Button>
          </Stack>
          {bucket.map((item, itemI) => (
              <Course 
                key={'$' + item.code + item.section}
                handleRemoval = {() => handleRemoval(bucketI, itemI)}
                {...item}
              />
          ))}
        </div>
      ))}
    </div>
  )
}
