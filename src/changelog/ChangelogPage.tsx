import { CardContent, Typography } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import { VERSION_FORMATTED } from "../env";
import { ModalCard } from "../modal/ModalCard";
import { CHANGELOG_MODAL_ID } from "../modal/modal";
import { saveLastReadChangelogVersion } from "./changelog";

export function ChangelogPage() {
  saveLastReadChangelogVersion(APP_VERSION);

  return (
    <ModalCard modalId={CHANGELOG_MODAL_ID}>
      <CardHeader
        title="OwlClock🦉 Changelog"
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
        <Typography color="text.secondary">Current version: {VERSION_FORMATTED}</Typography>
        <br />
        <Typography variant="h5">v1.1.1</Typography>
        <ul>
          <li>Added changelog page</li>
          <li>Improved responsiveness on smaller screens</li>
          <li>Fixed an issue where dragging slider in settings outside the modal closed it</li>
        </ul>
        <Typography variant="h5">v1.1.0</Typography>
        <ul>
          <li>Implemented integration with "Calendar!" extension</li>
        </ul>
        <Typography variant="h5">v1.0.0</Typography>
        <ul>
          <li>Initial release</li>
        </ul>
      </CardContent>
    </ModalCard>
  );
}
