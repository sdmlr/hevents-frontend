import React from "react";

const Spinner = () => {
  return (
    <div className="flex justify-center items-center py-6">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
};

export default Spinner;
