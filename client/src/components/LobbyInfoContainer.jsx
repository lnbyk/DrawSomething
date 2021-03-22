import React, { useState } from "react";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Tables from "@material-ui/core/Table";
import CustomButton from "./CustomButton";
import "../App.css";
import { Backdrop, CircularProgress } from "@material-ui/core";
const LobbyInfoContainer = (props) => {
  const [aButtonText, setAButtonText] = useState("available rooms");
  const { createRoom, players, showAvailableRooms } = props;

  const columns = [
    { id: "name", label: "Name", minWidth: 120 },
    {
      id: "id",
      label: "ID",
      minWidth: 270,
      align: "left",
    },
  ];
  return (
    <div className="info-container">
      <div
        style={{
          position: "absolute",
          top: "2%",
          textAlign: "center",
          width: "80%",
        }}
      >
        <b>total players: {players.length}</b>
      </div>
      <div className="players-info">
        <TableContainer style={{ minHeight: "100%" }}>
          <Backdrop style={{ zIndex: 20 }} open={false}>
            <CircularProgress color="inherit" />
          </Backdrop>
          <Tables stickyHeader aria-label="sticky table" size="small">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {players.map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
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
      <div className="lobby-button-groups">
        <CustomButton
          backgroundColor="lightblue"
          width="80%"
          onClick={createRoom}
        >
          New Room
        </CustomButton>
        <CustomButton
          backgroundColor="lightblue"
          width="80%"
          onClick={() => {
            showAvailableRooms();
            setAButtonText((e) =>
              e === "available rooms" ? "all rooms" : "available rooms"
            );
          }}
        >
          {aButtonText}
        </CustomButton>
      </div>
    </div>
  );
};

export default LobbyInfoContainer;
