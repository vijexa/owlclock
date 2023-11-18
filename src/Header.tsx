import { InfoOutlined } from "@mui/icons-material";
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
        action={
          <IconButton
            onClick={() => OBR.modal.open({
              id: "rodeo.owlbear.example/modal",
              url: "#/info",
              height: 430,
              width: 400,
            })}
          >
            <InfoOutlined></InfoOutlined>
          </IconButton>
        }
      />
      <Divider variant="middle" />
    </>
  );
}
