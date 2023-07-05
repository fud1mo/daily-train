import React, { useEffect, useReducer } from 'react';
import { Button } from 'antd';
import GanttModal from '@/components/GanttModal';

const initState = {
  visible: false,
  record: undefined
};

const reducer = (state = initState, action) => {
  const { type, value } = action;
  switch (type) {
    case type:
      return { ...state, ...value };
    default:
      return { ...state }
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initState);
  const { visible, record } = state;

  const handleOpenProject = async () => {
    dispatch({
      type: 'setGantt',
      value: {
        record: {
          okr_proj_name: '项目x'
        },  //此处record传入了一个简化且固定的值用于演示
        visible: true
      }
    })
  }

  return (
    <div className="App">
      <Button onClick={handleOpenProject}>打开甘特图</Button>
      {visible &&
        <GanttModal
          visible={visible}
          record={record}
          dispatch={dispatch}
        />
      }
    </div>
  );
}

export default App;
