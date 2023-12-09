import { InfoOutlined, SettingsOutlined } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import OBR from "@owlbear-rodeo/sdk";
import { INFO_MODAL_ID, SETTINGS_MODAL_ID } from "./modal/modal";

interface HeaderProps {
  isGm: boolean;
}

export function Header({ isGm }: HeaderProps) {
  return (
    <>
      <CardHeader
        title="OwlClock🦉"
        titleTypographyProps={{
          sx: {
            fontSize: "1.125rem",
            fontWeight: "bold",
            lineHeight: "32px",
            color: "text.primary",
          },
        }}
        action={<>
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
        </>
        }
      />
      <Divider variant="middle" />
    </>
  );
}
