import { RouterProvider } from 'react-router-dom';

// routing
import router from 'routes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';

import ThemeCustomization from 'themes';
import { LookupProvider } from './context/LookupContext';
import LookupProviderRenderer from './components/lookukp/LookupProviderRenderer';

// auth provider

// ==============================|| APP ||============================== //

export default function App() {
  return (
    <ThemeCustomization>
      <NavigationScroll>
          <LookupProvider>
            <RouterProvider router={router} />
            <LookupProviderRenderer />
          </LookupProvider>
      </NavigationScroll>
    </ThemeCustomization>
  );
}
