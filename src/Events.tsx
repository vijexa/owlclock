import { Duration, LocalTime } from "@js-joda/core";
import { Delete } from "@mui/icons-material";
import { IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Typography } from "@mui/material";


interface Event {
    text: string;
    description?: string;
    timeLeft: Duration;
}

const events: Event[] = [
    {
        text: "Event text",
        description: "Event description",
        timeLeft: Duration.ofMinutes(10)
    },
    {
        text: "Another event",
        description: "Another event description",
        timeLeft: Duration.ofMinutes(20)
    },
    {
        text: "Without description",
        timeLeft: Duration.ofMinutes(30)
    },
    {
        text: "Negative time event",
        description: "So negative",
        timeLeft: Duration.ofMinutes(-20)
    }
];

export function Events() {
    const eventListItems = events.sort((a, b) => a.timeLeft.toMinutes() - b.timeLeft.toMinutes()).map((event, index) =>
        <ListItem
            key={index}
            secondaryAction={
                <IconButton>
                    <Delete />
                </IconButton>
            }
            sx={{
                paddingBottom: '0',
                paddingTop: '0',
            }}
        >
            <ListItemText
                sx={{
                    color: 'text.primary',
                }}
                primary={
                    <span>
                        <Typography display="inline" color="text.secondary" variant="body2">
                            {event.timeLeft.toMinutes()}m
                        </Typography>
                        &nbsp;| {event.text}
                    </span>
                }
                secondary={event.description}
            />
        </ListItem>
    );

    return (
        <>
            <List
                subheader={
                    <ListSubheader
                        component="div"
                        sx={{
                            backgroundColor: 'transparent',
                            lineHeight: '2rem',
                            color: 'text.primary',
                            fontSize: '1.25rem'
                        }}>
                        Events
                    </ListSubheader>
                }
            >
                {eventListItems}
            </List>
        </>
    );
}
