import React, { forwardRef, useEffect, useState ,useImperativeHandle} from "react";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Tables from "@material-ui/core/Table";
import { Toolbar, Typography } from "@material-ui/core";
const GameSummary = forwardRef((props, ref) => {
  const [height, setHeight] = useState(400 * 0.2);
  const [isShow, setIsShow] = useState(false);
  const [promiseInfo, setPromiseInfo] = useState(null);

  useImperativeHandle(ref, () => ({
    show: async () => {
      return new Promise((resolve, reject) => {
        setIsShow(true);
        setPromiseInfo({ resolve, reject });
      });
    },
  }));

  const players = [
    {
      name: "121",
      correctGuess: 2,
      score: 11,
    },
    {
      name: "121",
      correctGuess: 2,
      score: 11,
    },
    {
      name: "121",
      correctGuess: 2,
      score: 11,
    },
    {
      name: "121",
      correctGuess: 2,
      score: 11,
    },
    {
      name: "121",
      correctGuess: 2,
      score: 11,
    },
  ];

  const columns = [
    { id: "name", label: "Name", minWidth: 20, align: "center" },
    {
      id: "correctGuess",
      label: "CorrectGuess",
      minWidth: 5,
      align: "center",
    },
    {
      id: "score",
      label: "Score",
      minWidth: 10,
      align: "center",
    },
  ];
  return (
    <div style={styles.GameSummaryContainer}>
      <Toolbar style={{ ...styles.toolbar }}>
        <Typography
          variant="h6"
          color="inherit"
          style={{ flexGrow: 1, color: "orange" }}
        >
          Game Summary
        </Typography>
      </Toolbar>

      <TableContainer style={{ minHeight: "80%" }}>
        <Tables stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow style={{ height: height }}>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, fontWeight: "bold" }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {players.map((row) => {
              return (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={row.code}
                  style={{ height: height }}
                >
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === "number"
                          ? column.format(value)
                          : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Tables>
      </TableContainer>
    </div>
  );
});

const styles = {
  GameSummaryContainer: {
    position: "absolute",
    minWidth: "400px",
    minHeight: "500px",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "gainsboro",

    borderRadius: "40px",
    boxShadow:
      "0 5px 12px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    overflow: "hidden",
  },
  toolbar: {
    backgroundColor: "#333",
    border: "solid 1px",
    boxShadow: `0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)`,
    textAlign: "center",
  },
};

export default GameSummary;
