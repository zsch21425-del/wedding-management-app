import React, { useState, useMemo } from 'react';
import {
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Filter,
  Sparkles,
  TrendingUp,
  DollarSign,
  X,
} from 'lucide-react';
import { Article, ArticleCategory } from '../../types';

interface Props {
  articles: Article[];
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
}

// Component: Trends & Ideas Hub - Magazine-style article feed
const TrendsHub: React.FC<Props> = ({
  articles,
  bookmarkedIds,
  onToggleBookmark,
}) => {
  // State management for filters
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | null>(null);
  const [showBookmarked, setShowBookmarked] = useState(false);

  // All available categories for filtering
  const categories: ArticleCategory[] = [
    'Trends',
    'Budget Tips',
    'Décor',
    'Food & Drink',
    'Attire',
    'Venues',
    'Entertainment',
  ];

  // Filter articles based on selected category and bookmarked status
  const filteredArticles = useMemo(() => {
    let filtered = articles;

    if (selectedCategory) {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    if (showBookmarked) {
      filtered = filtered.filter(article => bookmarkedIds.includes(article.id));
    }

    return filtered;
  }, [articles, selectedCategory, showBookmarked, bookmarkedIds]);

  // Handle "Money Saving Tips" quick filter
  const handleMoneyTipsFilter = () => {
    if (selectedCategory === 'Budget Tips') {
      setSelectedCategory(null);
    } else {
      setSelectedCategory('Budget Tips');
      setShowBookmarked(false);
    }
  };

  // Check if article is bookmarked
  const isBookmarked = (id: string) => bookmarkedIds.includes(id);

  return (
    <div className="animate-fade-in">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-8 h-8 text-rose-500" />
          <h1 className="font-serif text-4xl font-bold text-gray-900">
            Trends & Ideas Hub
          </h1>
        </div>
        <p className="text-gray-600 max-w-2xl">
          Discover curated articles, tips, and inspiration for your wedding day.
        </p>
      </div>

      {/* Filter Controls Section */}
      <div className="mb-8 space-y-4">
        {/* Top Control Row: Money Saving Tips Button */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleMoneyTipsFilter}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
              selectedCategory === 'Budget Tips'
                ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Money Saving Tips
          </button>

          {/* Bookmarked Filter Toggle */}
          <button
            onClick={() => setShowBookmarked(!showBookmarked)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
              showBookmarked
                ? 'bg-rose-100 text-rose-700 ring-2 ring-rose-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <BookmarkCheck className="w-4 h-4" />
            Bookmarked
          </button>

          {/* Active Filters Display */}
          {(selectedCategory || showBookmarked) && (
            <div className="flex items-center gap-2 ml-auto">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {selectedCategory && !showBookmarked && `Filtered: ${selectedCategory}`}
                {showBookmarked && !selectedCategory && 'Showing bookmarked articles'}
                {selectedCategory && showBookmarked && `${selectedCategory} • Bookmarked`}
              </span>
            </div>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(
                  selectedCategory === category ? null : category
                );
                setShowBookmarked(false);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-white border border-gray-300 text-gray-700 hover:border-rose-300 hover:bg-rose-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Clear Filters Button - visible when filters are active */}
        {(selectedCategory || showBookmarked) && (
          <button
            onClick={() => {
              setSelectedCategory(null);
              setShowBookmarked(false);
            }}
            className="flex items-center gap-2 text-rose-600 hover:text-rose-700 font-medium transition-colors"
          >
            <X className="w-4 h-4" />
            Clear all filters
          </button>
        )}
      </div>

      {/* Results Section */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-16">
          <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">
            No articles found
          </p>
          <p className="text-gray-500 text-sm">
            Try adjusting your filters to discover more ideas.
          </p>
        </div>
      ) : (
        <>
          {/* Results Count */}
          <p className="text-gray-600 mb-6 text-sm">
            Showing {filteredArticles.length} of {articles.length} articles
          </p>

          {/* Magazine-Style Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map(article => (
              <article
                key={article.id}
                className="card-hover bg-white rounded-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg flex flex-col"
              >
                {/* Gradient Thumbnail */}
                <div
                  className="h-40 relative overflow-hidden group"
                  style={{
                    background: article.gradient,
                  }}
                >
                  {/* Bookmark Button Overlay */}
                  <button
                    onClick={() => onToggleBookmark(article.id)}
                    className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all backdrop-blur-sm z-10"
                    aria-label={
                      isBookmarked(article.id)
                        ? 'Remove bookmark'
                        : 'Bookmark article'
                    }
                  >
                    {isBookmarked(article.id) ? (
                      <BookmarkCheck className="w-5 h-5 text-rose-500 fill-rose-500" />
                    ) : (
                      <Bookmark className="w-5 h-5 text-gray-600" />
                    )}
                  </button>

                  {/* Optional: Gradient Overlay for Text Contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Content Section */}
                <div className="p-4 flex flex-col flex-grow">
                  {/* Category Tag */}
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-rose-50 text-rose-700 text-xs font-semibold rounded-full">
                      {article.category}
                    </span>
                  </div>

                  {/* Article Title */}
                  <h3 className="font-serif text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-snug">
                    {article.title}
                  </h3>

                  {/* Article Summary */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
                    {article.summary}
                  </p>

                  {/* External Link Button */}
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 font-medium text-sm transition-colors group"
                  >
                    Read more
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TrendsHub;
