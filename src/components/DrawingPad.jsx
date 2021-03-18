import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { SketchField } from "react-sketch";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import { CompactPicker, CirclePicker } from "react-color";
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
import { useSelector } from "react-redux";
import {
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";

// select icons
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import CreateIcon from "@material-ui/icons/Create";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import Crop75Icon from "@material-ui/icons/Crop75";
const fabric = require("fabric").fabric;

const Tools = [
  {
    name: "pencil",
    render: <CreateIcon />,
  },
  {
    name: "circle",
    render: <RadioButtonUncheckedIcon />,
  },
  {
    name: "arrow",
    render: <ArrowForwardIcon />,
  },
  {
    name: "line",
    render: <RemoveIcon />,
  },
  {
    name: "rectangle",
    render: <Crop75Icon />,
  },
];

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

const DrawingPad = forwardRef((props, ref) => {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [lineColor, setLineColor] = useState("black");
  const [lineWidth, setLineWidth] = useState(10);
  const [controlledValue, setControlledValue] = useState(null);
  const [tool, setTool] = useState(Tools[0].name);
  const { isEditing, roomid } = props;

  const selectedRoom = useSelector((state) => {
    return state.room.room.find((v) => v.id === roomid);
  });

  const refs = useRef(null);
  var _sketch = null;
  // props from parent
  const { initialValue } = props;
  // update canvas for thoes who are guessing
  useEffect(() => {
    _sketch.fromJSON(initialValue);
    _sketch._onMouseDown = () => {};
  }, [initialValue, _sketch]);

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

  const _selectTool = (v) => {
    setTool(v.target.value);
  };
  const _undo = () => {
    try {
      _sketch.undo();
      setCanUndo(_sketch.canUndo());
      setCanRedo(_sketch.canRedo());
    } catch (err) {
      console.log("undo error", err);
    }
  };

  const _redo = () => {
    try {
      _sketch.redo();
      setCanUndo(_sketch.canUndo());
      setCanRedo(_sketch.canRedo());
    } catch (err) {
      console.log("redo error", err);
    }
  };

  const _save = () => {
    localStorage.setItem("1111", JSON.stringify(_sketch.toJSON()));
  };

  useImperativeHandle(ref, () => ({
    _clear: _clear,
  }));

  const _download = () => {
    //console.save(_sketch.toDataURL(), 'toDataURL.txt');
    //console.save(JSON.stringify(_sketch.toJSON()), 'toDataJSON.txt');

    /*eslint-enable no-console*/
    window.location.href = _sketch
      .toDataURL()
      .replace("image/png", "image/octet-stream");
    // imgDown.href = _sketch.toDataURL();
    // imgDown.download = 'toPNG.png';
    // imgDown.dispatchEvent(event);
  };

  const _clear = () => {
    _sketch.clear();
    _sketch.setBackgroundFromDataUrl("");

    setCanUndo(_sketch.canUndo)
    setCanRedo(_sketch.canRedo());
  };

  const _onSketchChange = (e) => {
    // console.log(isEditing);
    try {
      let prev = canUndo;
      let now = _sketch.canUndo();
      props.onDraw(JSON.stringify(_sketch.toJSON()));
      if (prev !== now) {
        setCanUndo(now);
      }
    } catch (err) {}
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
      <div height="10%">
        {isEditing ? (
          <Toolbar style={{ ...styles.toolbar, display: isEditing }}>
            <Typography
              variant="h6"
              color="inherit"
              style={{ flexGrow: 1, color: "orange" }}
            >
              {selectedRoom && selectedRoom.currentQuestion.question}
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
              {selectedRoom && `提示 : ${selectedRoom.currentQuestion.hint}`}
            </Typography>
            <IconButton color="primary" onClick={_clear}>
              <DeleteIcon />
            </IconButton>
          </Toolbar>
        )}
      </div>

      <div height="80%">
        {isEditing ? (
          <SketchField
            name="sketch"
            className="canvas-area"
            ref={(c) => (_sketch = c)}
            lineColor={lineColor}
            lineWidth={lineWidth}
            fillColor={"transparent"}
            height={630}
            backgroundColor={"transparent"}
            defaultValue={initialValue}
            value={controlledValue}
            forceValue
            onChange={_onSketchChange}
            tool={tool}
          />
        ) : (
          <DisplayedCanvas
            style={{ width: "100%", height: 630 }}
            passCanvasHandler={passCanvasHandler}
          />
        )}
      </div>
      {isEditing ?
      <div>
        <Toolbar
          style={{
            ...styles.toolbar,
            backgroundColor: 'lightgray',
            zIndex: 4,
            display: "flex",
            padding: 5,
            justifyContent: "space-around",
          }}
        >
          <FormControl variant="outlined" style={{ width: "20%" }}>
            <InputLabel id="demo-simple-select-outlined-label">
              tools
            </InputLabel>

            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={tool}
              label="Age"
              onChange={_selectTool}
            >
              {Tools.map((v) => {
                return (
                  <MenuItem value={v.name} key={v.name}>
                    <div style={{ display: "flex" }}>
                      {v.render} {v.name}
                    </div>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <CirclePicker
            id="lineColor"
            color={lineColor}
            onChange={(color) => setLineColor(color.hex)}
            width="50%"
          />
        </Toolbar>
      </div> : null}
    </div>
  );
});

const styles = {
  toolbar: {
    backgroundColor: "#333",
    border: "solid 1px",
    boxShadow: `0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)`,
  },
};

export default DrawingPad;

// console.log(localStorage.getItem("1111"));
