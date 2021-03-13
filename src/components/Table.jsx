import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import "./Table.css";
const Table = (props) => {
  const [height, setHeight] = useState(0);


  const { joinHandler} = props
  return (
    <div
      className="round-table"
      style={{ width: props.width, height: props.height }}
    >
      <Button
        variant="contained"
        style={{
          backgroundColor: "#00FF00",
          width: "40%",
          height: "15%",
          borderRadius: "30px",
          borderWidth: "2px 2px",
          left: '50%',
          top: '90%',
          transform: 'translateX(-50%) translateY(-100%)'
        }}
        onClick={joinHandler}
        
      >
        JOIN
      </Button>
    </div>
  );
};

export default Table;
