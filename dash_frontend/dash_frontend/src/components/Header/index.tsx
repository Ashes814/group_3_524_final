import { useContext } from "react";
import MapContext from "../../store/map-context";
import type { DatePickerProps } from 'antd';
import { DatePicker, Space } from 'antd';
import "./index.css";
const Header: React.FC = () => {
  const { map } = useContext(MapContext);
  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString);
  };
  return (
    <>
      <header className="header">
        <h1>UK TRAFFIC ACCIDENTS</h1>

        <Space direction="vertical">
          <DatePicker onChange={onChange} />
        </Space>
      </header>
    </>
  );
};
export default Header;
