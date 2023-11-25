import { GitHub } from "@mui/icons-material";
import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";

export function InfoPage() {
  return (
    <>
      <Card sx={{ boxShadow: "none" }}>
        <CardHeader
          title="OwlClock🦉 Information"
          titleTypographyProps={{
            sx: {
              fontSize: "1.125rem",
              fontWeight: "bold",
              lineHeight: "32px",
              color: "text.primary",
            },
          }}
        />
        <Divider variant="middle" />
        <CardContent>
          <Typography

          >
            This extension provides a simple way to keep track of in-game time during the day.
          </Typography>
          <br />
          <Typography>
            You can edit the time directly by editing it in the text field, or by using the "Add" field
            and "Hours"/"Minutes" buttons. The time will be saved in room data. Only GM can edit the time.
            Temporarily only 24-hour (ISO) time format is supported.
          </Typography>
          <br />
          <Typography>
            If there are any bugs, feel free to <a href="https://github.com/vijexa/owlclock/issues/new" target="_blank">open an issue</a> on GitHub. Contributions are welcome!
          </Typography>
        </CardContent>
        <CardActions>

          <Button
            startIcon={<GitHub />}
            sx={{ color: 'text.primary' }}
            href="https://github.com/vijexa/owlclock"
            target="_blank" >
            GitHub
          </Button>
        </CardActions>
      </Card >
    </>
  );
}
