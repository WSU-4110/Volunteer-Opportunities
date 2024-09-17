export default function UserPicture(props: any) {
  return (
    <div>
      <h1>Picture</h1>
      <button data-open-modal>Edit</button>
      <dialog data-modal>
        <div>Picture</div>
        <button data-close-modal>Save</button>
      </dialog>
    </div>
  );
}
