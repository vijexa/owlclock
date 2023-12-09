
import { Box, Card } from "@mui/material";
import OBR from "@owlbear-rodeo/sdk";
import React from 'react';

interface ModalBoxProps {
    modalId: string;
    children: React.ReactNode;
}

export function ModalCard({ modalId, children }: ModalBoxProps) {
    return <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100vw"
        height="100vh"
        onClick={() => OBR.modal.close(modalId)}
    >
        <Card
            sx={{ boxShadow: 'none', maxWidth: '400px', margin: '16px' }}
            onClick={e => e.stopPropagation()}
        >
            {children}
        </Card>
    </Box>
}
