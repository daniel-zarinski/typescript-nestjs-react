import React, { useEffect } from 'react';

const App = (): JSX.Element => {
  useEffect(() => {
    console.log('hello1');
  }, []);

  return (
    <div>
      <h2>Welcome to React App1</h2>
      <h3>Date : {new Date().toDateString()}</h3>
    </div>
  );
};

export default App;
