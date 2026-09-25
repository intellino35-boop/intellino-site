import Footer from '../Components/Footer';
import Navbar from '../Components/Navbar';

export default function SiteLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col bg-[#080808]">
            <Navbar />
            {children}
            <Footer />
        </div>
    );
}
