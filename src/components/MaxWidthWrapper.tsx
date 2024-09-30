import React from "react";

const MaxWidthWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-[90%] m-auto mt-20">{children}</div>;
};

export default MaxWidthWrapper;
