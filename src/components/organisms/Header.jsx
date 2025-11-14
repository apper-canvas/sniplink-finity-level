import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ linkCount = 0 }) => {
  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
              <ApperIcon name="Link2" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                SnipLink
              </h1>
              <p className="text-sm text-gray-600">URL Shortener</p>
            </div>
          </div>
<div className="text-right">
            <div className="text-sm text-gray-500">Total Links</div>
            <div className="text-2xl font-bold text-primary">
              {linkCount}
            </div>
          </div>
        </div>
      </div>
    </header>
);
};

export default Header;