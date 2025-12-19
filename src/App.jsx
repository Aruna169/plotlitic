import { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import ChartDisplay from './components/ChartDisplay';
import { saveAppFeedback } from './services/firebaseService';

const generateUUID = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

function App() {
  const [activeTab, setActiveTab] = useState('sheet');
  const [dataPoints, setDataPoints] = useState([{ x: '', y: '' }]);
  const [sheetSize, setSheetSize] = useState({ x: 180, y: 250 });
  const [squeeze, setSqueeze] = useState({ x: 10, y: 10 });
  const [tickCounts, setTickCounts] = useState({ x: 5, y: 5 });
  const [show10mmMarkers, setShow10mmMarkers] = useState(true);
  const [tickLabelMode, setTickLabelMode] = useState('all'); // 'none', 'interval', 'all'
  const [chartZoom, setChartZoom] = useState(1); // Chart zoom level
  const chartRef = useRef(null);

  // Session Tracking
  const [sessionId] = useState(() => generateUUID());
  const [sessionStartTime] = useState(() => Date.now());
  const [lastActionTime, setLastActionTime] = useState(() => Date.now());



  // Offline detection
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-save logic
  const saveTimeoutRef = useRef(null);

  const handleAutoSave = useCallback((newDataPoints) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      const validPoints = newDataPoints
        .filter(p => p.x !== '' && p.y !== '' && !isNaN(p.x) && !isNaN(p.y))
        .map(p => ({ x: parseFloat(p.x), y: parseFloat(p.y) }));

      if (validPoints.length === 0) return;

      const currentTime = Date.now();
      const duration = currentTime - sessionStartTime;
      const interval = currentTime - lastActionTime;

      try {
        await saveAppFeedback({
          feedback: 'Auto-save',
          validPoints,
          sheetSize,
          squeeze,
          sessionId,
          sessionStartTime,
          duration,
          interval
        });
        console.log('Auto-saved to Firebase');
        setLastActionTime(currentTime);
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, 2000);
  }, [sheetSize, squeeze, sessionId, sessionStartTime, lastActionTime]);



  const scales = useMemo(() => {
    const validPoints = dataPoints
      .filter(p => p.x !== '' && p.y !== '' && !isNaN(p.x) && !isNaN(p.y))
      .map(p => ({ x: parseFloat(p.x), y: parseFloat(p.y) }));

    if (validPoints.length === 0) return { x: 0, y: 0 };

    const xValues = validPoints.map(p => p.x);
    const yValues = validPoints.map(p => p.y);

    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);

    const xRange = maxX - minX || 1;
    const yRange = maxY - minY || 1;

    const drawingWidth = sheetSize.x - 2 * squeeze.x;
    const drawingHeight = sheetSize.y - 2 * squeeze.y;

    return {
      x: xRange / drawingWidth,
      y: yRange / drawingHeight
    };
  }, [dataPoints, sheetSize, squeeze]);

  return (
    <div className="app-container">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        sheetSize={sheetSize}
        setSheetSize={setSheetSize}
        squeeze={squeeze}
        setSqueeze={setSqueeze}
        scales={scales}
        dataPoints={dataPoints}
        setDataPoints={setDataPoints}


        onAutoSave={handleAutoSave}
        tickCounts={tickCounts}
        setTickCounts={setTickCounts}
        show10mmMarkers={show10mmMarkers}
        setShow10mmMarkers={setShow10mmMarkers}
        tickLabelMode={tickLabelMode}
        setTickLabelMode={setTickLabelMode}
        chartZoom={chartZoom}
        setChartZoom={setChartZoom}
        sessionId={sessionId}
        sessionStartTime={sessionStartTime}
        lastActionTime={lastActionTime}
      />

      <div className="main-content">
        <div className="chart-panel" ref={chartRef}>
          <ChartDisplay
            dataPoints={dataPoints}
            sheetSize={sheetSize}
            squeeze={squeeze}
            tickCounts={tickCounts}
            show10mmMarkers={show10mmMarkers}
            tickLabelMode={tickLabelMode}
            chartZoom={chartZoom}
            setChartZoom={setChartZoom}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
