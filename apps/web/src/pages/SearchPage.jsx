import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import SearchEngine from '@/components/SearchEngine.jsx';
import SearchModifier from '@/components/SearchModifier.jsx';
import SearchResults from '@/components/SearchResults.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const SearchPage = () => {
  const [searchCriteria, setSearchCriteria] = useState(null);
  const [isEditing, setIsEditing] = useState(true);

  useEffect(() => {
    // Load saved search from localStorage on mount
    const saved = localStorage.getItem('takeon_search');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.where || parsed.checkIn || parsed.checkOut || parsed.guests) {
          setSearchCriteria(parsed);
          setIsEditing(false); // If we have saved data, show results immediately
        }
      } catch (e) {
        console.error('Error parsing saved search', e);
      }
    }
  }, []);

  const handleSearch = (criteria) => {
    setSearchCriteria(criteria);
    setIsEditing(false);
    localStorage.setItem('takeon_search', JSON.stringify(criteria));
    
    // Scroll slightly to results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (searchCriteria) {
      setIsEditing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <Helmet>
        <title>Search Properties | TakeOn BnB</title>
        <meta name="description" content="Find the perfect stay for your next trip." />
      </Helmet>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search Header Area */}
        <div className="relative z-10 w-full mb-8">
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="engine"
                initial={{ opacity: 0, y: -20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full flex justify-center py-4"
              >
                <div className="w-full max-w-4xl">
                  <h1 className="text-3xl font-bold text-foreground text-center mb-6">Where to next?</h1>
                  <SearchEngine 
                    onSearch={handleSearch} 
                    initialData={searchCriteria} 
                    onCancel={searchCriteria ? handleCancelEdit : undefined}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="modifier"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="w-full py-2 sticky top-20 bg-background/95 backdrop-blur z-40 pb-4 border-b border-border mb-6"
              >
                <SearchModifier 
                  criteria={searchCriteria} 
                  onEditClick={handleEditClick} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Area */}
        <div className="w-full">
          {searchCriteria && !isEditing ? (
            <SearchResults criteria={searchCriteria} />
          ) : (
            isEditing && !searchCriteria && (
              <div className="text-center py-20 opacity-50 mt-10">
                <SearchEngine className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-xl font-medium text-muted-foreground">Enter a destination to start searching</p>
              </div>
            )
          )}
        </div>

      </div>
    </div>
  );
};

export default SearchPage;