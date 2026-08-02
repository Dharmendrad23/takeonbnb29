import React from 'react';
import SearchResultsPage from './SearchResultsPage.jsx';

// For simplicity and DRY principles, we route /properties and /search to similar experiences.
// In a full app, PropertiesPage might have a static sidebar, while Search is map-heavy.
export default function PropertiesPage() {
  return <SearchResultsPage />;
}