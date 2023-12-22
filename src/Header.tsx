import { Book, InfoOutlined, SettingsOutlined } from "@mui/icons-material";
import { Badge, IconButton, Tooltip } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import OBR from "@owlbear-rodeo/sdk";
import { IS_PROD } from "./env";
import { CHANGELOG_MODAL_ID, INFO_MODAL_ID, SETTINGS_MODAL_ID } from "./modal/modal";

interface HeaderProps {
  isGm: boolean;
  lastReadChangelogVersion: string;
}

export function Header({ isGm, lastReadChangelogVersion }: HeaderProps) {
  const isChangelogRead = lastReadChangelogVersion === APP_VERSION;

  return (
    <>
      <CardHeader
        title={IS_PROD ? "OwlClock🦉" : "OwlClock🦉 (dev)"}
        titleTypographyProps={{
          sx: {
            fontSize: "1.125rem",
            fontWeight: "bold",
            lineHeight: "32px",
            color: "text.primary",
          },
        }}
        action={
          <>
            <Tooltip arrow title="Changelog">
              <IconButton
                onClick={() => OBR.modal.open({
                  id: CHANGELOG_MODAL_ID,
                  url: "/#/changelog",
                  hidePaper: true,
                  fullScreen: true,
                })}
              >
                <Badge color="primary" variant="dot" invisible={isChangelogRead}>
                  <Book></Book>
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip arrow title="Information">
              <IconButton
                onClick={() => OBR.modal.open({
                  id: INFO_MODAL_ID,
                  url: "/#/info",
                  hidePaper: true,
                  fullScreen: true,
                })}
              >
                <InfoOutlined></InfoOutlined>
              </IconButton>
            </Tooltip>
            <Tooltip arrow title="Settings">
              <IconButton
                onClick={() => OBR.modal.open({
                  id: SETTINGS_MODAL_ID,
                  // passing isGm as a query param for more consistent rendering
                  url: "/#/settings?isGm=" + isGm,
                  hidePaper: true,
                  fullScreen: true,
                })}
              >
                <SettingsOutlined></SettingsOutlined>
              </IconButton>
            </Tooltip>
          </>
        }
      />
      <Divider variant="middle" />
    </>
  );
}
