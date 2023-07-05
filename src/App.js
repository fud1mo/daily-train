import LongForm from './pages/longForm';
import React, { useEffect, useState, Suspense } from 'react';
import Layout from './pages/layout';
import { BrowserRouter as Router } from 'react-router-dom';
import Loading from '@/components/Loading';

function App() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      setCount(1);
      setCount(2);
    }, 0)
  }, [])
  console.log('render:', count)
  return (
    <Router>
      <Suspense fallback={<div><Loading /></div>}>
        <div className="App">
          {/* <LongForm/> */}
          <Layout />
        </div>
      </Suspense>
    </Router>
  );
}

export default App;
