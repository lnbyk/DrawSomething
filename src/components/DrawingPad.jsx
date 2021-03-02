import React, { useState, useRef, useEffect } from "react";
import { SketchField, Tools } from "react-sketch";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import IconButton from "@material-ui/core/IconButton";

import UndoIcon from "@material-ui/icons/Undo";
import RedoIcon from "@material-ui/icons/Redo";
import DeleteIcon from "@material-ui/icons/Delete";
import SaveIcon from "@material-ui/icons/Save";
import ClearIcon from "@material-ui/icons/Clear";
import AddIcon from "@material-ui/icons/Add";
import CopyIcon from "@material-ui/icons/FileCopy";
import RemoveIcon from "@material-ui/icons/Remove";
import DownloadIcon from "@material-ui/icons/CloudDownload";
import Typography from "@material-ui/core/Typography/Typography";


import { db } from "../services/firebase";

const fabric = require("fabric").fabric;

const DisplayedCanvas = (props) => {
  return (
    <div style={{ ...props.style }}>
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: "transparent",
          zIndex: 3,
        }}
      />
      <div
        style={{
          zIndex: 2,
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
      >
        <SketchField
          height={700}
          ref={(c) => {
            props.passCanvasHandler(c);
          }}
        ></SketchField>
      </div>
    </div>
  );
};

const DrawingPad = (props) => {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [lineColor, setLineColor] = useState("black");
  const [lineWidth, setLineWidth] = useState(10);
  const [controlledValue, setControlledValue] = useState(null);
  const [tool, setTool] = useState(Tools.Pencil);
  const [isEditing, setIsEditing] = useState(true);

  const refs = useRef(null);
  var _sketch = null;
  // props from parent
  const { initialValue } = props;
  // update canvas for thoes who are guessing
  useEffect(() => {
    _sketch.fromJSON(initialValue);
    _sketch._onMouseDown = () => {};
  }, [initialValue, _sketch, isEditing]);


  // handle update to database
  //  useEffect( () => {
  //   try {
  //      db.ref("canvas").push({
  //       content: _sketch.toJSON(),
  //       timestamp: Date.now(),
  //       uid: "sss"
  //     })
  //   } catch (error) {
  //     alert(error);
  //   }
  // },[_sketch])



  const _undo = () => {
    _sketch.undo();
    setCanUndo(_sketch.canUndo());
    setCanRedo(_sketch.canRedo());
  };

  const _redo = () => {
    _sketch.redo();
    setCanUndo(_sketch.canUndo());
    setCanRedo(_sketch.canRedo());
  };

  const _save = () => {
    localStorage.setItem("1111", JSON.stringify(_sketch.toJSON()));
  };

  const _download = () => {
    //console.save(_sketch.toDataURL(), 'toDataURL.txt');
    //console.save(JSON.stringify(_sketch.toJSON()), 'toDataJSON.txt');

    /*eslint-enable no-console*/
    console.log(_sketch.toDataURL());
    window.location.href = _sketch
      .toDataURL()
      .replace("image/png", "image/octet-stream");
    // imgDown.href = _sketch.toDataURL();
    // imgDown.download = 'toPNG.png';
    // imgDown.dispatchEvent(event);
  };

  const _clear = () => {
    setIsEditing((e) => !e);
  };

  const _onSketchChange = (e) => {
    let prev = canUndo;
    let now = _sketch.canUndo();
    if (prev !== now) {
      setCanUndo(now);
    }
  };

  const passCanvasHandler = (c) => {
    _sketch = c;
  };

  useEffect(() => {
    (function (console) {
      console.save = function (data, filename) {
        if (!data) {
          console.error("Console.save: No data");
          return;
        }
        if (!filename) filename = "console.json";
        if (typeof data === "object") {
          data = JSON.stringify(data, undefined, 4);
        }
        var blob = new Blob([data], { type: "text/json" }),
          e = document.createEvent("MouseEvents"),
          a = document.createElement("a");
        a.download = filename;
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
        e.initMouseEvent(
          "click",
          true,
          false,
          window,
          0,
          0,
          0,
          0,
          0,
          false,
          false,
          false,
          false,
          0,
          null
        );
        a.dispatchEvent(e);
      };
    })(console);
  }, []);

  return (
    <div>
      <div>
        {isEditing ? (
          <Toolbar style={{ ...styles.toolbar, display: isEditing }}>
            <Typography
              variant="h6"
              color="inherit"
              style={{ flexGrow: 1, color: "orange" }}
            >
              Sketch Tool
            </Typography>
            <IconButton color="primary" disabled={!canUndo} onClick={_undo}>
              <UndoIcon />
            </IconButton>
            <IconButton color="primary" disabled={!canRedo} onClick={_redo}>
              <RedoIcon />
            </IconButton>
            <IconButton color="primary" onClick={_save}>
              <SaveIcon />
            </IconButton>
            <IconButton color="primary" onClick={_download}>
              <DownloadIcon />
            </IconButton>
            <IconButton color="primary" onClick={_clear}>
              <DeleteIcon />
            </IconButton>
          </Toolbar>
        ) : (
          <Toolbar
            style={{
              ...styles.toolbar,
              display: !isEditing,
              textAlign: "center",
            }}
          >
            <Typography
              variant="h6"
              color="inherit"
              style={{ flexGrow: 1, color: "orange" }}
            >
              ... is isEditing
            </Typography>
            <IconButton color="primary" onClick={_clear}>
              <DeleteIcon />
            </IconButton>
          </Toolbar>
        )}
      </div>

      <div>
        {isEditing ? (
          <SketchField
            name="sketch"
            className="canvas-area"
            ref={(c) => (_sketch = c)}
            lineColor={lineColor}
            lineWidth={lineWidth}
            fillColor={"transparent"}
            height={700}
            backgroundColor={"transparent"}
            defaultValue={initialValue}
            value={controlledValue}
            forceValue
            onChange={_onSketchChange}
            tool={tool}
          />
        ) : (
          <DisplayedCanvas
            style={{ width: "100%", height: 700 }}
            passCanvasHandler={passCanvasHandler}
          />
        )}
      </div>
    </div>
  );
};

const styles = {
  toolbar: {
    backgroundColor: "#333",
  },
};

export default DrawingPad;

console.log(localStorage.getItem("1111"));
