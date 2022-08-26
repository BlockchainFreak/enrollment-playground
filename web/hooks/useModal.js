import { useState } from "react"
import { Box, Modal,  } from '@mui/material'

export default function useModal(data) {

    const [modal, setModal] = useState(data)

    const AddModal = (props) => (
        <Modal
            open={modal !== null}
            onClose={() => setModal(null)}
        >
            <Box sx={{...style}}>
                {props.children}
            </Box>
        </Modal>
    )
    return [modal, setModal, AddModal]
}



const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: "90vw",
    maxHeight: "80vh",
    minHeight: "80vh",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};