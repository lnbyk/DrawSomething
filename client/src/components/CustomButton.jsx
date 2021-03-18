import React from "react";
import Button from "@material-ui/core/Button";

const CustomButton = (props) => {
  return (
    <Button
      variant="contained"
      style={{
        backgroundColor: props.backgroundColor,
        width: props.width,
        height: props.height,
        borderRadius: "30px",
        border: props.border || "solid gray",
        borderWidth: "2px 2px",
      }}

      onClick={props.onClick}
    >
      {props.children}
    </Button>
  );
};

export default CustomButton
