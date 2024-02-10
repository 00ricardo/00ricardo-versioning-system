import { useEffect } from 'react';
import { useDispatch } from 'react-redux'; // Import useDispatch from react-redux
import { setUser } from './redux/reducers/configuration';
import BackdropLoading from './components/BackdropLoading';
import VersioningSystemDialog from './components/VersioningSystemDialog';
import { SnackbarProvider } from 'notistack';
import Notifications from './components/Notifications';
function App() {
  const dispatch = useDispatch(); // Get the dispatch function from the Redux store
  useEffect(() => {
    dispatch(setUser('Ricardo'));
  }, [dispatch]);

  return (
    <SnackbarProvider maxSnack={3}>
      <BackdropLoading />
      <VersioningSystemDialog />
      <Notifications />
    </SnackbarProvider>
  );
}

export default App;
