import { InfoOutlined, SettingsOutlined } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import OBR from "@owlbear-rodeo/sdk";

export function Header() {
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
              id: "com.github.vijexa.owlclock/infoModal",
              url: "/owlclock/#/info",
              height: 430,
              width: 400,
            })}
          >
            <InfoOutlined></InfoOutlined>
          </IconButton>
          <IconButton
            onClick={() => OBR.modal.open({
              id: "com.github.vijexa.owlclock/settingsModal",
              url: "/owlclock/#/settings",
              height: 300,
              width: 300,
              // this kind of allows to visually resize the modal
              hidePaper: true,
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
