import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const ParticipantList = ({ participants }) => {
  const [imageLoading, setImageLoading] = useState({});
  const imgRefs = useRef({});

  useEffect(() => {
    const loadingState = {};
    participants.forEach(p => {
      const id = p._id || p.id;
      loadingState[id] = true;
    });
    setImageLoading(loadingState);

    // Set up event listeners for each image
    const cleanupFunctions = [];
    participants.forEach(p => {
      const id = p._id || p.id;
      const img = imgRefs.current[id];

      if (img) {
        // If image is already loaded
        if (img.complete && img.naturalWidth > 0) {
          setImageLoading(prev => ({ ...prev, [id]: false }));
        } else if (img.complete && img.naturalWidth === 0) {
          // Image failed to load
          setImageLoading(prev => ({ ...prev, [id]: false }));
        } else {
          // Image is still loading, set up event listeners
          const handleLoad = () => {
            setImageLoading(prev => ({ ...prev, [id]: false }));
          };
          const handleError = () => {
            setImageLoading(prev => ({ ...prev, [id]: false }));
          };

          img.addEventListener('load', handleLoad);
          img.addEventListener('error', handleError);

          cleanupFunctions.push(() => {
            img.removeEventListener('load', handleLoad);
            img.removeEventListener('error', handleError);
          });
        }
      }
    });

    // Fallback: set loading to false after 2 seconds for any remaining loading images
    const fallbackTimer = setTimeout(() => {
      setImageLoading(prev => {
        const newState = { ...prev };
        participants.forEach(p => {
          const id = p._id || p.id;
          if (newState[id]) {
            newState[id] = false;
          }
        });
        return newState;
      });
    }, 2000);

    return () => {
      clearTimeout(fallbackTimer);
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [participants]);

  const handleImageLoad = (participantId) => {
    setImageLoading(prev => ({ ...prev, [participantId]: false }));
  };

  const handleImageError = (participantId) => {
    setImageLoading(prev => ({ ...prev, [participantId]: false }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md p-4"
    >
      <h3 className="text-lg font-semibold mb-4">Participants ({participants.length})</h3>
      <div className="space-y-3">
        {participants.map((participant) => {
          const participantId = participant._id || participant.id;
          const isLoading = imageLoading[participantId];

          return (
            <motion.div
              key={participantId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="relative">
                {isLoading && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse absolute inset-0"></div>
                )}
                <img
                  ref={(el) => imgRefs.current[participantId] = el}
                  src={participant.avatar || '/default-avatar.png'}
                  alt={participant.name}
                  className="w-8 h-8 rounded-full object-cover"
                  onLoad={() => handleImageLoad(participantId)}
                  onError={() => handleImageError(participantId)}
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{participant.name}</p>
                <p className="text-sm text-gray-500">{participant.email}</p>
              </div>
              {participant.isOnline && (
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ParticipantList;
