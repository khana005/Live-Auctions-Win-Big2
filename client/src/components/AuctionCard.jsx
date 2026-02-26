import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CountdownTimer from './CountdownTimer';

const AuctionCard = ({ auction, index }) => {
  const isEnded = auction.status === 'ended' || new Date(auction.endTime) < new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-card rounded-2xl overflow-hidden auction-card"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={auction.image}
          alt={auction.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          {isEnded ? (
            <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-semibold rounded-full border border-red-500/30">
              Ended
            </span>
          ) : (
            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full border border-green-500/30">
              Live
            </span>
          )}
        </div>

        {/* Timer (only for active auctions) */}
        {!isEnded && (
          <div className="absolute bottom-3 left-3 right-3">
            <CountdownTimer endTime={auction.endTime} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <Link to={`/auctions/${auction._id}`}>
          <h3 className="text-lg font-semibold text-white mb-2 hover:text-primary-400 transition-colors line-clamp-1">
            {auction.title}
          </h3>
        </Link>
        
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">
          {auction.description}
        </p>

        {/* Price Info */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs">Current Bid</p>
            <p className="text-2xl font-bold text-primary-400 font-mono">
              ${auction.currentPrice?.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-xs">{auction.bidCount || 0} bids</p>
            {auction.winner && (
              <p className="text-accent-400 text-xs">Winner: {auction.winner.name}</p>
            )}
          </div>
        </div>

        {/* View Button */}
        <Link
          to={`/auctions/${auction._id}`}
          className="mt-4 block w-full text-center py-2.5 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-500/30 rounded-lg text-primary-400 hover:from-primary-500 hover:to-secondary-500 hover:text-white transition-all duration-300"
        >
          {isEnded ? 'View Details' : 'Place Bid'}
        </Link>
      </div>
    </motion.div>
  );
};

export default AuctionCard;
