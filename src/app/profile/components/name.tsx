"use client";

import Organization from "./organization";

import { useState } from "react";

export default function UserPage(props: any) {
  const state = true;
  const [pageChoice, setChoice] = useState(state);

  const changeChoice: any = (check: any) => {
    console.log(check.target.checked);
    setChoice(check.target.checked);
  };

  if (pageChoice) {
    return (
      <div>
        <input
          type="checkbox"
          name="pageChoice"
          id="pageChoice"
          checked={pageChoice}
          onChange={changeChoice}
        ></input>
        <div></div>
      </div>
    );
  } else {
    return (
      <div>
        <input
          type="checkbox"
          name="pageChoice"
          id="pageChoice"
          checked={pageChoice}
          onChange={changeChoice}
        ></input>
        <div>
          <Organization />
        </div>
      </div>
    );
  }
}
