import { useState, useEffect, useRef } from 'react'
import { Typography, Box, Stack, Button } from '@mui/material'
import Course from './Course'

export default function Bucket({data, setModal}) {

  const [buckets, setBuckets] = useState(data);

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

  const handleAdd = (bucketI) => {
    setModal(bucketI)
  }

  return (
    <div className="drag-n-drop">
      {buckets?.map((bucket, bucketI) => (
        <div
          key={bucketI} 
          className="dnd-group"
        >
          <Stack direction="row">
            <Typography variant="h5" textAlign='center' sx={{width: "100%"}}>
              <strong>BUCKET {bucketI + 1}</strong>
            </Typography>
            <Button
              variant='contained'
              color='primary'
              onClick={() => handleAdd(bucketI)}
              sx= {{
                marginBottom: "20px", 
                display: (bucketI && buckets[bucketI - 1].length === 0) ? "none" : ""
            }}>
            ADD
            </Button>
          </Stack>
          {bucket?.map((item, itemI) => (
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
