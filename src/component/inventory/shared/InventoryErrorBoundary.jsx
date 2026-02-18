import React from 'react';

export default class InventoryErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('Inventory widget crashed:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl">
          <h2 className="text-lg font-bold text-red-700">Widget failed to render</h2>
          <p className="text-sm text-red-600 mt-1">
            Refresh the page or switch tabs. The rest of the dashboard is still available.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
