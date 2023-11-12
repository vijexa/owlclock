import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";

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
      />
      <Divider variant="middle" />
    </>
  );
}
