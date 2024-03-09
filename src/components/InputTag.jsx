import { WithContext as ReactTags } from 'react-tag-input';

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

function InputTag({ tags, setTags }) {
  // Method to delete tag from Array
  const handleDelete = i => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  // Method to Add tag into Array
  const handleAddition = tag => {
    console.log(tag);
    setTags([...tags, tag]);
    console.log(tags);
  };
  return (
    <>
      <ReactTags
        tags={tags}
        delimiters={delimiters}
        handleDelete={handleDelete}
        handleAddition={handleAddition}
        inputFieldPosition="top"
        autocomplete
        allowDragDrop={false}
        autofocus={false}
      />
    </>
  );
}

export default InputTag;
