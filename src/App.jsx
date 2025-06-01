import { Provider } from 'react-redux';
import { RouterProvider, Route, Routes } from 'react-router-dom';
import store from './store';
import router from './router';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router}>
        <Routes>
          {/* Your existing routes */}
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </RouterProvider>
    </Provider>
  );
}

export default App;
