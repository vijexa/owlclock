import { GitHub } from "@mui/icons-material";
import { Box, Button, CardActions, CardContent, Typography } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import { IS_PROD } from "../env";
import { ModalCard } from "../modal/ModalCard";
import { INFO_MODAL_ID } from "../modal/modal";

export function InfoPage() {
  return (
    <ModalCard modalId={INFO_MODAL_ID}>
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
        <Typography>
          This extension provides a simple way to keep track of in-game time during the day.
        </Typography>
        <br />
        <Typography>
          You can edit the time directly by editing it in the text field, or by using the "Add" field
          and "Hours"/"Minutes" buttons. The time will be saved in room data. Only GM can edit the time.
          You can switch between 24-hour and 12-hour time format in the settings.
        </Typography>
        <br />
        <Typography>
          There is an integration with the "Calendar!" extension! You can enable it in "OwlClock" settings.
          It will change the date when time passes midnight.
        </Typography>
        <br />
        <Typography>
          If there are any bugs, feel free to <a href="https://github.com/vijexa/owlclock/issues/new" target="_blank">open an issue</a> on GitHub. Contributions are welcome!
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          startIcon={<GitHub />}
          sx={{ color: 'text.primary', marginLeft: '8px' }}
          href="https://github.com/vijexa/owlclock"
          target="_blank" >
          GitHub
        </Button>
        <Box marginLeft="auto" marginRight="16px">
          <Typography color="text.secondary">
            v{APP_VERSION}{IS_PROD ? "" : " (dev build)"}
          </Typography>
        </Box>
      </CardActions>
    </ModalCard>
  );
}
