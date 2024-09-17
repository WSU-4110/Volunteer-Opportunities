import React from "react";

export default function UserBio(props: any) {
  if (props.name == null) {
    return (
      <div>
        <h1>placeholder</h1>
        <button data-open-modal>Edit</button>
        <dialog data-modal>
          <div>User Bio</div>
          <button data-close-modal>Save</button>
        </dialog>
      </div>
    );
  } else {
    return (
      <div>
        <h1>placeholder</h1>
        <button data-open-modal>Edit</button>
        <dialog data-modal>
          <div>User Bio</div>
          <button data-close-modal>Save</button>
        </dialog>
      </div>
    );
  }
}
