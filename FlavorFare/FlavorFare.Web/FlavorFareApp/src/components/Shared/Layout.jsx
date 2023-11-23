import Header from './Header';
import Footer from './Footer'
import { SnackbarProvider } from '../ContextProviders/SnackbarProvider';
import UserContextProvider from '../ContextProviders/UserContextProvider';

export function Layout({ children }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
            <UserContextProvider>
                <SnackbarProvider>
                    <Header />
                    <main style={{ flex: 1 }}>
                        {children}
                    </main>
                    <Footer />
                </SnackbarProvider>
            </UserContextProvider>
        </div>
    );
}