import React, { useEffect, useState } from "react";
import "./Table.css";
const Table = (props) => {
  const [height, setHeight] = useState(0);



  return (
    <div
      className="round-table"
      style={{ width: props.width, height: props.height}}
    ></div>
  );
};

export default Table;
