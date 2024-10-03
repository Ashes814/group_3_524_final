import React, { useState } from "react";
import { Button, Drawer } from 'antd';
import "./index.css";
const HomeView: React.FC = () => {

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  const showDrawerHis = () => {
    setOpen(true);
  };

  const onCloseHis = () => {
    setOpen(false);
  };

  const showDrawerPred = () => {
    setOpen2(true);
  };

  const onClosePred = () => {
    setOpen2(false);
  };

  return (
    <div>


      <Button className="show-btn" type="primary" onClick={showDrawerHis}>
        VISUALIZATION
      </Button>
      <Drawer className="drawer" title="Historical Data Visualization" onClose={onCloseHis} open={open}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>

      <Button className="show-btn btn-pred" type="primary" onClick={showDrawerPred}>
        PREDICTION
      </Button>
      <Drawer className="drawer" title="Historical Data Visualization" onClose={onClosePred} open={open2}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
    </div>
  );
};

export default HomeView;
