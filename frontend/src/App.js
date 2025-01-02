import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CSSReset } from '@chakra-ui/react';
import { routes } from './routes/public';
// import Home from './pages/home';

function App() {
  return (
    <BrowserRouter>
      <CSSReset />
      <Routes>
        {routes.map((route, index) => {
          const Page = route.page
          return(
          <Route
          key={index}
          path={route.path}
          element={<Page />}
          />
          )
        })}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
