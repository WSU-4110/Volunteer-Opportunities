

export default function Picture() {

    return (
    <div>
        <h1>Organization Picture</h1>
        <button data-open-modal>Edit</button>
        <dialog data-modal>
            <div>Name</div>
            <button data-close-modal>Save</button>
        </dialog>
        
    </div>);
}