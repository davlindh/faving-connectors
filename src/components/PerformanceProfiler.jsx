import React, { Profiler } from 'react';

const PerformanceProfiler = ({ children }) => {
  const onRenderCallback = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interactions
  ) => {
    // Log performance data
    console.log(`Component ${id} rendered:`);
    console.log(`Phase: ${phase}`);
    console.log(`Actual duration: ${actualDuration}`);
    console.log(`Base duration: ${baseDuration}`);
    console.log(`Start time: ${startTime}`);
    console.log(`Commit time: ${commitTime}`);
    console.log(`Interactions: ${JSON.stringify(interactions)}`);

    // You can send this data to a performance monitoring service here
  };

  return (
    <Profiler id="App" onRender={onRenderCallback}>
      {children}
    </Profiler>
  );
};

export default PerformanceProfiler;