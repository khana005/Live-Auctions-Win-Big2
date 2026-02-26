import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900/80 border-t border-slate-800 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-2xl font-bold gradient-text">BidVault</span>
            </Link>
            <p className="text-slate-400 text-sm">
              The premier live auction platform. Bid, win, and collect unique items from around the world.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/auctions" className="text-slate-400 hover:text-primary-400 transition-colors">Browse Auctions</Link></li>
              <li><Link to="/dashboard" className="text-slate-400 hover:text-primary-400 transition-colors">My Dashboard</Link></li>
              <li><Link to="/register" className="text-slate-400 hover:text-primary-400 transition-colors">Create Account</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-primary-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-slate-400 hover:text-primary-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>Email: support@bidvault.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Auction St, NY</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} BidVault. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
