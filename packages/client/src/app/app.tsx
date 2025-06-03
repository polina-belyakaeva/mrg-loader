import { Route, Routes } from 'react-router-dom';
import MainPage from '../pages/main';
import styles from './App.module.css';

export function App() {
  return (
    <div className={styles.appWrapper}>
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
    </div>
  );
}

export default App;